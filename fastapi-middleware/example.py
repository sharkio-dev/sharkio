"""
Example: using SharkioMockMiddleware in a FastAPI app.

1. Export your mock config from Sharkio:
       curl -H "Authorization: Bearer <token>" \
         https://<your-sharkio>/sharkio/sniffer/<snifferId>/export \
         > sharkio_mocks.json

2. Run this file:
       uvicorn example:app --reload
"""

from fastapi import FastAPI
from sharkio_mock_middleware import SharkioMockMiddleware

app = FastAPI()

# Load from exported file
app.add_middleware(SharkioMockMiddleware, config_path="sharkio_mocks.json")

# --- or load from an in-memory dict (e.g. fetched at startup) ---
#
# import httpx, os
#
# @app.on_event("startup")
# async def load_mocks():
#     async with httpx.AsyncClient() as client:
#         r = await client.get(
#             f"{os.environ['SHARKIO_URL']}/sharkio/sniffer/{os.environ['SNIFFER_ID']}/export",
#             headers={"Authorization": f"Bearer {os.environ['SHARKIO_TOKEN']}"},
#         )
#         r.raise_for_status()
#         app.middleware_stack = None          # force rebuild
#         for layer in app.middleware_stack:
#             if isinstance(layer, SharkioMockMiddleware):
#                 layer.load_config(r.json())
#                 break


@app.get("/health")
def health():
    return {"status": "ok"}
