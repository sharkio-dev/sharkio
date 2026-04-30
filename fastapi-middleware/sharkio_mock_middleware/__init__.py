"""
Sharkio Mock Middleware for FastAPI

Usage:
    from sharkio_mock_middleware import SharkioMockMiddleware

    app = FastAPI()
    app.add_middleware(SharkioMockMiddleware, config_path="sharkio_mocks.json")

Set MOCK_CONFIG_OUTPUT_DIR on the Sharkio server to auto-write the config file
whenever mocks change in the UI. The middleware will pick up changes within
`reload_interval` seconds (default: 1).

You can also reload the config manually:
    middleware_instance.reload()
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
        config_path: Optional[str] = None,
        config: Optional[Dict[str, Any]] = None,
        passthrough_on_miss: bool = True,
        auto_reload: bool = True,
        reload_interval: float = 1.0,
    ) -> None:
        super().__init__(app)
        self._config_path = Path(config_path) if config_path else None
        self._mocks: List[Dict[str, Any]] = []
        self._passthrough_on_miss = passthrough_on_miss
        self._lock = threading.Lock()
        self._last_mtime: Optional[float] = None

        if config is not None:
            self._load_from_dict(config)
        elif self._config_path is not None:
            self.reload()

        if auto_reload and self._config_path is not None:
            self._start_watcher(reload_interval)

    # ------------------------------------------------------------------
    # Public helpers
    # ------------------------------------------------------------------

    def reload(self) -> None:
        """Re-read the config file from disk. Thread-safe."""
        if self._config_path is None:
            raise ValueError("No config_path set — pass a config dict instead.")
        with open(self._config_path, "r", encoding="utf-8") as fh:
            data = json.load(fh)
        self._load_from_dict(data)
        self._last_mtime = self._config_path.stat().st_mtime

    def load_config(self, config: Dict[str, Any]) -> None:
        """Replace the running config with a new in-memory dict."""
        self._load_from_dict(config)

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _load_from_dict(self, data: Dict[str, Any]) -> None:
        with self._lock:
            self._mocks = data.get("mocks", [])

    def _start_watcher(self, interval: float) -> None:
        def _watch() -> None:
            while True:
                threading.Event().wait(interval)
                try:
                    mtime = self._config_path.stat().st_mtime  # type: ignore[union-attr]
                    if mtime != self._last_mtime:
                        self.reload()
                except Exception:
                    pass

        t = threading.Thread(target=_watch, daemon=True)
        t.start()

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
