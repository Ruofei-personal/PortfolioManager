import json

from fastapi import HTTPException, status

from app.schemas import PortfolioPayload

CATEGORY_MAP = {
    "股票": "股票",
    "虚拟币": "虚拟币",
    "ETF": "ETF",
    "stock": "股票",
    "crypto": "虚拟币",
    "etf": "ETF",
}
SUPPORTED_CURRENCIES = {"USD", "CNY", "EUR", "JPY"}
RISK_LEVELS = {"low", "medium", "high"}
MAX_NAME_LENGTH = 120
MAX_NOTE_LENGTH = 200
MAX_TAGS = 8
MAX_TAG_LENGTH = 20
MAX_STRATEGY_LENGTH = 40
MAX_SENTIMENT_LENGTH = 40


def normalize_name(name: str) -> str:
    return " ".join(name.strip().split())


def normalize_category(raw_category: str) -> str | None:
    raw_category = raw_category.strip()
    return CATEGORY_MAP.get(raw_category) or CATEGORY_MAP.get(raw_category.lower())


def normalize_currency(raw_currency: str) -> str | None:
    cleaned = raw_currency.strip().upper()
    return cleaned if cleaned in SUPPORTED_CURRENCIES else None


def normalize_risk_level(raw_level: str) -> str | None:
    cleaned = raw_level.strip().lower()
    return cleaned if cleaned in RISK_LEVELS else None


def normalize_strategy(raw_strategy: str | None) -> str | None:
    if not raw_strategy:
        return None
    cleaned = " ".join(raw_strategy.strip().split())
    if not cleaned or len(cleaned) > MAX_STRATEGY_LENGTH:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid strategy.")
    return cleaned


def normalize_sentiment(raw_sentiment: str | None) -> str | None:
    if not raw_sentiment:
        return None
    cleaned = " ".join(raw_sentiment.strip().split())
    if not cleaned or len(cleaned) > MAX_SENTIMENT_LENGTH:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid sentiment.")
    return cleaned


def normalize_tags(tags: list[str]) -> list[str]:
    if not tags:
        return []
    normalized = []
    seen = set()
    for tag in tags:
        cleaned = " ".join(tag.strip().split())
        if not cleaned:
            continue
        if len(cleaned) > MAX_TAG_LENGTH:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid tag.")
        key = cleaned.lower()
        if key in seen:
            continue
        seen.add(key)
        normalized.append(cleaned)
        if len(normalized) > MAX_TAGS:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Too many tags.")
    return normalized


def encode_tags(tags: list[str]) -> str | None:
    if not tags:
        return None
    return json.dumps(tags, ensure_ascii=False)


def decode_tags(raw: str | None) -> list[str]:
    if not raw:
        return []
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            return [str(tag) for tag in parsed if str(tag).strip()]
    except json.JSONDecodeError:
        pass
    return [tag.strip() for tag in raw.split(",") if tag.strip()]


def normalize_portfolio_payload(
    payload: PortfolioPayload,
) -> tuple[str, str, str | None, list[str], str, float | None, str, str | None, str | None]:
    if payload.quantity <= 0 or payload.cost < 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid portfolio data.")
    name = normalize_name(payload.name)
    if not name or len(name) > MAX_NAME_LENGTH:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid portfolio data.")
    note = payload.note.strip() if payload.note else None
    if note and len(note) > MAX_NOTE_LENGTH:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid portfolio data.")
    category = normalize_category(payload.category)
    if not category:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category.")
    currency = normalize_currency(payload.currency)
    if not currency:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid currency.")
    risk_level = normalize_risk_level(payload.riskLevel)
    if not risk_level:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid risk level.")
    if payload.currentPrice is not None and payload.currentPrice < 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid current price.")
    strategy = normalize_strategy(payload.strategy)
    sentiment = normalize_sentiment(payload.sentiment)
    tags = normalize_tags(payload.tags)
    return name, category, note or None, tags, currency, payload.currentPrice, risk_level, strategy, sentiment
