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


def ensure_holdings_tags() -> None:
    with engine.begin() as conn:
        columns = {row[1] for row in conn.execute(text("PRAGMA table_info(holdings)")).fetchall()}
        if "tags" not in columns:
            conn.execute(text("ALTER TABLE holdings ADD COLUMN tags VARCHAR"))


def ensure_holdings_currency() -> None:
    with engine.begin() as conn:
        columns = {row[1] for row in conn.execute(text("PRAGMA table_info(holdings)")).fetchall()}
        if "currency" not in columns:
            conn.execute(
                text("ALTER TABLE holdings ADD COLUMN currency VARCHAR NOT NULL DEFAULT 'USD'")
            )
            conn.execute(text("UPDATE holdings SET currency = 'USD' WHERE currency IS NULL"))


def ensure_holdings_current_price() -> None:
    with engine.begin() as conn:
        columns = {row[1] for row in conn.execute(text("PRAGMA table_info(holdings)")).fetchall()}
        if "current_price" not in columns:
            conn.execute(text("ALTER TABLE holdings ADD COLUMN current_price FLOAT"))


def ensure_holdings_risk_level() -> None:
    with engine.begin() as conn:
        columns = {row[1] for row in conn.execute(text("PRAGMA table_info(holdings)")).fetchall()}
        if "risk_level" not in columns:
            conn.execute(
                text("ALTER TABLE holdings ADD COLUMN risk_level VARCHAR NOT NULL DEFAULT 'medium'")
            )
            conn.execute(text("UPDATE holdings SET risk_level = 'medium' WHERE risk_level IS NULL"))


def ensure_holdings_strategy() -> None:
    with engine.begin() as conn:
        columns = {row[1] for row in conn.execute(text("PRAGMA table_info(holdings)")).fetchall()}
        if "strategy" not in columns:
            conn.execute(text("ALTER TABLE holdings ADD COLUMN strategy VARCHAR"))


def ensure_holdings_sentiment() -> None:
    with engine.begin() as conn:
        columns = {row[1] for row in conn.execute(text("PRAGMA table_info(holdings)")).fetchall()}
        if "sentiment" not in columns:
            conn.execute(text("ALTER TABLE holdings ADD COLUMN sentiment VARCHAR"))


def run_migrations() -> None:
    ensure_holdings_category()
    ensure_holdings_note()
    ensure_holdings_tags()
    ensure_holdings_currency()
    ensure_holdings_current_price()
    ensure_holdings_risk_level()
    ensure_holdings_strategy()
    ensure_holdings_sentiment()
