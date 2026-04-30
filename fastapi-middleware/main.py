from fastapi import FastAPI
from sharkio_mock_middleware import SharkioMockMiddleware

app = FastAPI()

app.add_middleware(
    SharkioMockMiddleware,
    config_path="mocks.json",
)


@app.get("/")
def root():
    return {"message": "Hello from the real app"}
