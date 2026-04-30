import logging
import time

from fastapi import FastAPI, Request
from sharkio_mock_middleware import SharkioMockMiddleware

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)
logger = logging.getLogger("sharkio")

MOCK_CONFIG_PATH = "./sharkio_middleware_config.json"

app = FastAPI()

app.add_middleware(
    SharkioMockMiddleware,
    config_path=MOCK_CONFIG_PATH,
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000
    logger.info(
        "%s %s → %d (%.1fms)",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )
    return response


@app.get("/")
def root():
    return {"message": "Hello from the real app"}


if __name__ == "__main__":
    import os
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=[os.path.dirname(os.path.abspath(__file__)), os.path.dirname(os.path.abspath(MOCK_CONFIG_PATH))],
    )
