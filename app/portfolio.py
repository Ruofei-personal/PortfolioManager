from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select

from app.auth import now_utc, require_user
from app.db import get_db
from app.models import Holding, User
from app.schemas import HoldingResponse, PortfolioPayload

router = APIRouter()
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
            note=holding.note,
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
    raw_category = payload.category.strip()
    category = CATEGORY_MAP.get(raw_category) or CATEGORY_MAP.get(raw_category.lower())
    if not category:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category.")
    note = note or None

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
        holding.updated_at = now
        db.commit()
        return HoldingResponse(
            id=holding.id,
            name=holding.name,
            category=holding.category,
            quantity=holding.quantity,
            totalCost=holding.total_cost,
            note=holding.note,
        )

    holding = Holding(
        user_id=user.id,
        name=name,
        category=category,
        quantity=payload.quantity,
        total_cost=payload.cost,
        note=note,
        created_at=now,
        updated_at=now,
    )
    db.add(holding)
    db.commit()
    db.refresh(holding)
    return HoldingResponse(
        id=holding.id,
        name=holding.name,
        category=holding.category,
        quantity=holding.quantity,
        totalCost=holding.total_cost,
        note=holding.note,
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
    raw_category = payload.category.strip()
    category = CATEGORY_MAP.get(raw_category) or CATEGORY_MAP.get(raw_category.lower())
    if not category:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category.")
    note = note or None

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
    holding.note = note
    holding.updated_at = now_utc()
    db.commit()
    return HoldingResponse(
        id=holding.id,
        name=holding.name,
        category=holding.category,
        quantity=holding.quantity,
        totalCost=holding.total_cost,
        note=holding.note,
    )


@router.delete("/api/portfolio/{holding_id}")
def delete_portfolio(holding_id: int, user: User = Depends(require_user), db=Depends(get_db)):
    holding = db.execute(
        select(Holding).where(Holding.id == holding_id, Holding.user_id == user.id)
    ).scalar_one_or_none()
    if holding:
        db.delete(holding)
        db.commit()
    return {"ok": True}
