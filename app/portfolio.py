from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select

from app.auth import now_utc, require_user
from app.db import get_db
from app.models import Holding, User
from app.schemas import HoldingResponse, PortfolioPayload

router = APIRouter()


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
            quantity=holding.quantity,
            totalCost=holding.total_cost,
        )
        for holding in holdings
    ]


@router.post("/api/portfolio", response_model=HoldingResponse)
def add_portfolio(payload: PortfolioPayload, user: User = Depends(require_user), db=Depends(get_db)):
    if payload.quantity <= 0 or payload.cost < 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid portfolio data.")

    holding = db.execute(
        select(Holding).where(Holding.user_id == user.id, Holding.name == payload.name.strip())
    ).scalar_one_or_none()
    now = now_utc()

    if holding:
        holding.quantity += payload.quantity
        holding.total_cost += payload.cost
        holding.updated_at = now
        db.commit()
        return HoldingResponse(
            id=holding.id,
            name=holding.name,
            quantity=holding.quantity,
            totalCost=holding.total_cost,
        )

    holding = Holding(
        user_id=user.id,
        name=payload.name.strip(),
        quantity=payload.quantity,
        total_cost=payload.cost,
        created_at=now,
        updated_at=now,
    )
    db.add(holding)
    db.commit()
    db.refresh(holding)
    return HoldingResponse(
        id=holding.id,
        name=holding.name,
        quantity=holding.quantity,
        totalCost=holding.total_cost,
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
