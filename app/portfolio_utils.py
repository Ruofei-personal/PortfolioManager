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
MAX_NAME_LENGTH = 120
MAX_NOTE_LENGTH = 200
MAX_TAGS = 8
MAX_TAG_LENGTH = 20


def normalize_name(name: str) -> str:
    return " ".join(name.strip().split())


def normalize_category(raw_category: str) -> str | None:
    raw_category = raw_category.strip()
    return CATEGORY_MAP.get(raw_category) or CATEGORY_MAP.get(raw_category.lower())


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


def normalize_portfolio_payload(payload: PortfolioPayload) -> tuple[str, str, str | None, list[str]]:
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
    tags = normalize_tags(payload.tags)
    return name, category, note or None, tags
