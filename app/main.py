from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app import auth, portfolio
from app.db import engine, ensure_holdings_category, ensure_holdings_note
from app.models import Base

BASE_DIR = Path(__file__).resolve().parent.parent

app = FastAPI(title="Portfolio Manager API")

Base.metadata.create_all(engine)
ensure_holdings_category()
ensure_holdings_note()

app.mount("/static", StaticFiles(directory=BASE_DIR), name="static")
app.include_router(auth.router)
app.include_router(portfolio.router)


@app.get("/healthz")
def healthcheck():
    return {"status": "ok"}


@app.get("/")
def app_index():
    return FileResponse(BASE_DIR / "index.html")
