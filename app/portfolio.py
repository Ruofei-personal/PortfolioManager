from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select

from app.auth import now_utc, require_user
from app.db import get_db
from app.models import Holding, Transaction, User
from app.schemas import HoldingResponse, PortfolioPayload

router = APIRouter()
CATEGORY_MAP = {
    "股票": "股票",
    "虚拟币": "虚拟币",
    "ETF": "ETF",
    "现金": "现金",
    "stock": "股票",
    "crypto": "虚拟币",
    "etf": "ETF",
    "cash": "现金",
}
SUPPORTED_CURRENCIES = {"CNY", "USD", "HKD", "EUR"}
MAX_NAME_LENGTH = 120
MAX_NOTE_LENGTH = 200
MAX_TAGS_LENGTH = 200


def normalize_name(name: str) -> str:
    return " ".join(name.strip().split())


@router.get("/api/portfolio", response_model=list[HoldingResponse])
def list_portfolio(user: User = Depends(require_user), db=Depends(get_db)):
    holdings = (
        db.execute(select(Holding).where(Holding.user_id == user.id).order_by(Holding.updated_at.desc()))
        .scalars()
        .all()
    )
    return [
        HoldingResponse(
            id=holding.id,
            name=holding.name,
            category=holding.category,
            quantity=holding.quantity,
            totalCost=holding.total_cost,
            currentPrice=holding.current_price,
            currency=holding.currency,
            note=holding.note,
            tags=holding.tags,
        )
        for holding in holdings
    ]


@router.post("/api/portfolio", response_model=HoldingResponse)
def add_portfolio(payload: PortfolioPayload, user: User = Depends(require_user), db=Depends(get_db)):
    if payload.quantity <= 0 or payload.cost < 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid portfolio data.")
    name = normalize_name(payload.name)
    if not name or len(name) > MAX_NAME_LENGTH:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid portfolio data.")
    note = payload.note.strip() if payload.note else None
    if note and len(note) > MAX_NOTE_LENGTH:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid portfolio data.")
    tags = payload.tags.strip() if payload.tags else None
    if tags and len(tags) > MAX_TAGS_LENGTH:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid portfolio data.")
    currency = payload.currency.strip().upper()
    if currency not in SUPPORTED_CURRENCIES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid currency.")
    current_price = payload.currentPrice
    if current_price is not None and current_price < 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid portfolio data.")
    raw_category = payload.category.strip()
    category = CATEGORY_MAP.get(raw_category) or CATEGORY_MAP.get(raw_category.lower())
    if not category:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category.")
    note = note or None
    tags = tags or None

    holding = db.execute(
        select(Holding).where(
            Holding.user_id == user.id, func.lower(Holding.name) == name.lower()
        )
    ).scalar_one_or_none()
    now = now_utc()

    if holding:
        holding.quantity += payload.quantity
        holding.total_cost += payload.cost
        holding.category = category
        holding.note = note
        holding.tags = tags
        holding.currency = currency
        holding.current_price = current_price
        holding.updated_at = now
        db.add(
            Transaction(
                user_id=user.id,
                holding_name=holding.name,
                category=category,
                quantity=payload.quantity,
                total_cost=payload.cost,
                action="buy",
                created_at=now,
            )
        )
        db.commit()
        return HoldingResponse(
            id=holding.id,
            name=holding.name,
            category=holding.category,
            quantity=holding.quantity,
            totalCost=holding.total_cost,
            currentPrice=holding.current_price,
            currency=holding.currency,
            note=holding.note,
            tags=holding.tags,
        )

    holding = Holding(
        user_id=user.id,
        name=name,
        category=category,
        quantity=payload.quantity,
        total_cost=payload.cost,
        current_price=current_price,
        currency=currency,
        note=note,
        tags=tags,
        created_at=now,
        updated_at=now,
    )
    db.add(holding)
    db.add(
        Transaction(
            user_id=user.id,
            holding_name=name,
            category=category,
            quantity=payload.quantity,
            total_cost=payload.cost,
            action="buy",
            created_at=now,
        )
    )
    db.commit()
    db.refresh(holding)
    return HoldingResponse(
        id=holding.id,
        name=holding.name,
        category=holding.category,
        quantity=holding.quantity,
        totalCost=holding.total_cost,
        currentPrice=holding.current_price,
        currency=holding.currency,
        note=holding.note,
        tags=holding.tags,
    )


@router.put("/api/portfolio/{holding_id}", response_model=HoldingResponse)
def update_portfolio(
    holding_id: int, payload: PortfolioPayload, user: User = Depends(require_user), db=Depends(get_db)
):
    if payload.quantity <= 0 or payload.cost < 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid portfolio data.")
    next_name = normalize_name(payload.name)
    if not next_name or len(next_name) > MAX_NAME_LENGTH:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid portfolio data.")
    note = payload.note.strip() if payload.note else None
    if note and len(note) > MAX_NOTE_LENGTH:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid portfolio data.")
    tags = payload.tags.strip() if payload.tags else None
    if tags and len(tags) > MAX_TAGS_LENGTH:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid portfolio data.")
    currency = payload.currency.strip().upper()
    if currency not in SUPPORTED_CURRENCIES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid currency.")
    current_price = payload.currentPrice
    if current_price is not None and current_price < 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid portfolio data.")
    raw_category = payload.category.strip()
    category = CATEGORY_MAP.get(raw_category) or CATEGORY_MAP.get(raw_category.lower())
    if not category:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category.")
    note = note or None
    tags = tags or None

    holding = db.execute(
        select(Holding).where(Holding.id == holding_id, Holding.user_id == user.id)
    ).scalar_one_or_none()
    if not holding:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Holding not found.")

    if next_name != holding.name:
        conflict = db.execute(
            select(Holding).where(
                Holding.user_id == user.id,
                func.lower(Holding.name) == next_name.lower(),
                Holding.id != holding.id,
            )
        ).scalar_one_or_none()
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Holding name already exists."
            )

    holding.name = next_name
    holding.category = category
    holding.quantity = payload.quantity
    holding.total_cost = payload.cost
    holding.current_price = current_price
    holding.currency = currency
    holding.note = note
    holding.tags = tags
    holding.updated_at = now_utc()
    db.add(
        Transaction(
            user_id=user.id,
            holding_name=holding.name,
            category=category,
            quantity=payload.quantity,
            total_cost=payload.cost,
            action="update",
            created_at=holding.updated_at,
        )
    )
    db.commit()
    return HoldingResponse(
        id=holding.id,
        name=holding.name,
        category=holding.category,
        quantity=holding.quantity,
        totalCost=holding.total_cost,
        currentPrice=holding.current_price,
        currency=holding.currency,
        note=holding.note,
        tags=holding.tags,
    )


@router.delete("/api/portfolio/{holding_id}")
def delete_portfolio(holding_id: int, user: User = Depends(require_user), db=Depends(get_db)):
    holding = db.execute(
        select(Holding).where(Holding.id == holding_id, Holding.user_id == user.id)
    ).scalar_one_or_none()
    if holding:
        db.add(
            Transaction(
                user_id=user.id,
                holding_name=holding.name,
                category=holding.category,
                quantity=holding.quantity,
                total_cost=holding.total_cost,
                action="delete",
                created_at=now_utc(),
            )
        )
        db.delete(holding)
        db.commit()
    return {"ok": True}


@router.get("/api/transactions")
def list_transactions(user: User = Depends(require_user), db=Depends(get_db)):
    transactions = (
        db.execute(
            select(Transaction)
            .where(Transaction.user_id == user.id)
            .order_by(Transaction.created_at.desc())
            .limit(50)
        )
        .scalars()
        .all()
    )
    return [
        {
            "id": tx.id,
            "holdingName": tx.holding_name,
            "category": tx.category,
            "quantity": tx.quantity,
            "totalCost": tx.total_cost,
            "action": tx.action,
            "createdAt": tx.created_at.isoformat(),
        }
        for tx in transactions
    ]
