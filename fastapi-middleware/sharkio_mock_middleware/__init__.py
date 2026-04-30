"""
Sharkio Mock Middleware for FastAPI

Explicit usage:
    from sharkio_mock_middleware import SharkioMockMiddleware

    app = FastAPI()
    app.add_middleware(SharkioMockMiddleware, config_path="sharkio_mocks.json")

Implicit usage (middleware is added to every FastAPI app automatically):
    from sharkio_mock_middleware import auto_inject

    auto_inject(config_path="sharkio_mocks.json")  # call before FastAPI()

    app = FastAPI()  # SharkioMockMiddleware is already wired in

Set MOCK_CONFIG_OUTPUT_DIR on the Sharkio server to auto-write the config file
whenever mocks change in the UI. The middleware will pick up changes within
`reload_interval` seconds (default: 1).
"""

import asyncio
import json
import random
import re
import threading
from pathlib import Path
from typing import Any, Dict, List, Optional

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class _SequenceState:
    """Tracks per-mock cursor for sequential response selection."""

    def __init__(self) -> None:
        self._counters: Dict[str, int] = {}

    def next(self, mock_id: str, total: int) -> int:
        idx = self._counters.get(mock_id, 0) % total
        self._counters[mock_id] = idx + 1
        return idx


_sequence_state = _SequenceState()


def _select_response(mock: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    responses: List[Dict[str, Any]] = mock.get("responses", [])
    if not responses:
        return None

    method = mock.get("responseSelectionMethod", "default")

    if method == "random":
        return random.choice(responses)

    if method == "sequence":
        idx = _sequence_state.next(mock["id"], len(responses))
        return responses[idx]

    # default: use selectedResponseId
    selected_id = mock.get("selectedResponseId")
    if selected_id:
        for r in responses:
            if r["id"] == selected_id:
                return r

    return responses[0]


def _match_mock(
    mocks: List[Dict[str, Any]], method: str, path: str
) -> Optional[Dict[str, Any]]:
    method = method.upper()

    # exact match first
    for mock in mocks:
        if not mock.get("isActive", True):
            continue
        if mock["method"].upper() != method:
            continue
        if mock["url"] == path:
            return mock

    # regex fallback
    for mock in mocks:
        if not mock.get("isActive", True):
            continue
        if mock["method"].upper() != method:
            continue
        try:
            if re.fullmatch(mock["url"], path):
                return mock
        except re.error:
            continue

    return None


class SharkioMockMiddleware(BaseHTTPMiddleware):
    """
    FastAPI/Starlette middleware that serves mock responses from a Sharkio
    export config, with optional automatic hot-reload.

    Parameters
    ----------
    app:
        The ASGI application to wrap.
    config_path:
        Path to the JSON file written by Sharkio when MOCK_CONFIG_OUTPUT_DIR
        is set (file is named ``{snifferId}.json``).
    config:
        In-memory config dict (alternative to config_path).
    passthrough_on_miss:
        Forward unmatched requests to the real app (default True).
        Set to False to return 404 for unmatched routes.
    auto_reload:
        Watch config_path for changes and reload automatically (default True).
        Has no effect when config_path is not set.
    reload_interval:
        How often (seconds) to check whether the file changed (default 1.0).
    """

    def __init__(
        self,
        app,
        config_path: str = "./sharkio_middleware_config.json",
        config: Optional[Dict[str, Any]] = None,
        passthrough_on_miss: bool = True,
    ) -> None:
        super().__init__(app)
        self._config_path = Path(config_path)
        self._mocks: List[Dict[str, Any]] = []
        self._passthrough_on_miss = passthrough_on_miss
        self._lock = threading.Lock()

        if config is not None:
            self._load_from_dict(config)
        elif self._config_path.exists():
            self.reload()

    # ------------------------------------------------------------------
    # Public helpers
    # ------------------------------------------------------------------

    def reload(self) -> None:
        """Re-read the config file from disk."""
        with open(self._config_path, "r", encoding="utf-8") as fh:
            data = json.load(fh)
        self._load_from_dict(data)

    def load_config(self, config: Dict[str, Any]) -> None:
        """Replace the running config with a new in-memory dict."""
        self._load_from_dict(config)

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _load_from_dict(self, data: Dict[str, Any]) -> None:
        with self._lock:
            self._mocks = data.get("mocks", [])

    # ------------------------------------------------------------------
    # Middleware entry point
    # ------------------------------------------------------------------

    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        with self._lock:
            mocks_snapshot = list(self._mocks)

        mock = _match_mock(mocks_snapshot, request.method, path)

        if mock is None:
            if self._passthrough_on_miss:
                return await call_next(request)
            return Response(
                content=json.dumps({"detail": "No mock found for this route"}),
                status_code=404,
                media_type="application/json",
            )

        response_def = _select_response(mock)
        if response_def is None:
            if self._passthrough_on_miss:
                return await call_next(request)
            return Response(
                content=json.dumps({"detail": "Mock has no responses configured"}),
                status_code=404,
                media_type="application/json",
            )

        delay_ms = response_def.get("delay", 0)
        if delay_ms and delay_ms > 0:
            await asyncio.sleep(delay_ms / 1000)

        headers: Dict[str, str] = dict(response_def.get("headers") or {})
        body: str = response_def.get("body") or ""
        status: int = response_def.get("status", 200)

        media_type = headers.pop("content-type", headers.pop("Content-Type", "application/json"))

        return Response(
            content=body,
            status_code=status,
            headers=headers,
            media_type=media_type,
        )


def auto_inject(**middleware_kwargs) -> None:
    """
    Monkey-patch FastAPI so every app created after this call automatically
    gets SharkioMockMiddleware — no explicit add_middleware() needed.

    Call once at module level, before any FastAPI() instantiation:

        from sharkio_mock_middleware import auto_inject
        auto_inject(config_path="./sharkio_mocks.json")

        app = FastAPI()   # middleware is already wired in
    """
    try:
        from fastapi import FastAPI as _FastAPI
    except ImportError:
        raise ImportError("fastapi must be installed to use auto_inject()")

    _original_init = _FastAPI.__init__

    def _patched_init(self, *args, **kwargs):
        _original_init(self, *args, **kwargs)
        self.add_middleware(SharkioMockMiddleware, **middleware_kwargs)

    _FastAPI.__init__ = _patched_init
    _patch_uvicorn(middleware_kwargs.get("config_path", "./sharkio_middleware_config.json"))


def _patch_uvicorn(config_path: str) -> None:
    try:
        import uvicorn as _uvicorn
    except ImportError:
        return

    _original_run = _uvicorn.run

    config_file = Path(config_path).name

    def _patched_run(*args, **kwargs):
        reload_dirs = kwargs.get("reload_dirs")
        if reload_dirs is not None:
            dirs = [reload_dirs] if isinstance(reload_dirs, str) else list(reload_dirs)
            if config_path not in dirs:
                kwargs["reload_dirs"] = dirs + [config_path]

        includes = kwargs.get("reload_includes") or []
        if isinstance(includes, str):
            includes = [includes]
        if config_file not in includes:
            kwargs["reload_includes"] = list(includes) + [config_file]

        return _original_run(*args, **kwargs)

    _uvicorn.run = _patched_run


import os as _os
_env = _os.environ.get("ENVIRONMENT", "")
_enabled = _env == "local" or _os.environ.get("SHARKIO_MOCK_ENABLE") == "1"
_disabled = _os.environ.get("SHARKIO_MOCK_DISABLE") == "1"
if _enabled and not _disabled:
    auto_inject()
