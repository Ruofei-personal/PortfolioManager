from sqlalchemy import text

from app.db import engine


def ensure_holdings_category() -> None:
    with engine.begin() as conn:
        columns = {row[1] for row in conn.execute(text("PRAGMA table_info(holdings)")).fetchall()}
        if "category" not in columns:
            conn.execute(
                text("ALTER TABLE holdings ADD COLUMN category VARCHAR NOT NULL DEFAULT '股票'")
            )
            conn.execute(text("UPDATE holdings SET category = '股票' WHERE category IS NULL"))


def ensure_holdings_note() -> None:
    with engine.begin() as conn:
        columns = {row[1] for row in conn.execute(text("PRAGMA table_info(holdings)")).fetchall()}
        if "note" not in columns:
            conn.execute(text("ALTER TABLE holdings ADD COLUMN note VARCHAR"))


def run_migrations() -> None:
    ensure_holdings_category()
    ensure_holdings_note()
