from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app import auth, portfolio
from app.db import engine
from app.migrations import run_migrations
from app.models import Base

BASE_DIR = Path(__file__).resolve().parent.parent

app = FastAPI(title="Portfolio Manager API")

@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(engine)
    run_migrations()

app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
app.include_router(auth.router)
app.include_router(portfolio.router)


@app.get("/healthz")
def healthcheck():
    return {"status": "ok"}


@app.get("/")
def app_index():
    return FileResponse(BASE_DIR / "index.html")
