from pathlib import Path

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "portfolio.db"

engine = create_engine(f"sqlite:///{DB_PATH}", echo=False, future=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


def ensure_holdings_category():
    with engine.begin() as conn:
        columns = {row[1] for row in conn.execute(text("PRAGMA table_info(holdings)")).fetchall()}
        if "category" not in columns:
            conn.execute(
                text("ALTER TABLE holdings ADD COLUMN category VARCHAR NOT NULL DEFAULT '股票'")
            )
            conn.execute(text("UPDATE holdings SET category = '股票' WHERE category IS NULL"))


def ensure_holdings_note():
    with engine.begin() as conn:
        columns = {row[1] for row in conn.execute(text("PRAGMA table_info(holdings)")).fetchall()}
        if "note" not in columns:
            conn.execute(text("ALTER TABLE holdings ADD COLUMN note VARCHAR"))


def ensure_holdings_currency():
    with engine.begin() as conn:
        columns = {row[1] for row in conn.execute(text("PRAGMA table_info(holdings)")).fetchall()}
        if "currency" not in columns:
            conn.execute(
                text("ALTER TABLE holdings ADD COLUMN currency VARCHAR NOT NULL DEFAULT 'CNY'")
            )
            conn.execute(text("UPDATE holdings SET currency = 'CNY' WHERE currency IS NULL"))


def ensure_holdings_current_price():
    with engine.begin() as conn:
        columns = {row[1] for row in conn.execute(text("PRAGMA table_info(holdings)")).fetchall()}
        if "current_price" not in columns:
            conn.execute(text("ALTER TABLE holdings ADD COLUMN current_price FLOAT"))


def ensure_holdings_tags():
    with engine.begin() as conn:
        columns = {row[1] for row in conn.execute(text("PRAGMA table_info(holdings)")).fetchall()}
        if "tags" not in columns:
            conn.execute(text("ALTER TABLE holdings ADD COLUMN tags VARCHAR"))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
