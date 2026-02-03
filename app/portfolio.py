from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select

from app.auth import now_utc, require_user
from app.db import get_db
from app.models import Holding, User
from app.portfolio_utils import decode_tags, encode_tags, normalize_portfolio_payload
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
            category=holding.category,
            quantity=holding.quantity,
            totalCost=holding.total_cost,
            tags=decode_tags(holding.tags),
            note=holding.note,
        )
        for holding in holdings
    ]


@router.post("/api/portfolio", response_model=HoldingResponse)
def add_portfolio(payload: PortfolioPayload, user: User = Depends(require_user), db=Depends(get_db)):
    name, category, note, tags = normalize_portfolio_payload(payload)

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
        if tags:
            merged_tags = {tag.lower(): tag for tag in decode_tags(holding.tags)}
            for tag in tags:
                merged_tags[tag.lower()] = tag
            holding.tags = encode_tags(list(merged_tags.values()))
        holding.note = note
        holding.updated_at = now
        db.commit()
        return HoldingResponse(
            id=holding.id,
            name=holding.name,
            category=holding.category,
            quantity=holding.quantity,
            totalCost=holding.total_cost,
            tags=decode_tags(holding.tags),
            note=holding.note,
        )

    holding = Holding(
        user_id=user.id,
        name=name,
        category=category,
        quantity=payload.quantity,
        total_cost=payload.cost,
        tags=encode_tags(tags),
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
        tags=decode_tags(holding.tags),
        note=holding.note,
    )


@router.put("/api/portfolio/{holding_id}", response_model=HoldingResponse)
def update_portfolio(
    holding_id: int, payload: PortfolioPayload, user: User = Depends(require_user), db=Depends(get_db)
):
    next_name, category, note, tags = normalize_portfolio_payload(payload)

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
    holding.tags = encode_tags(tags)
    holding.note = note
    holding.updated_at = now_utc()
    db.commit()
    return HoldingResponse(
        id=holding.id,
        name=holding.name,
        category=holding.category,
        quantity=holding.quantity,
        totalCost=holding.total_cost,
        tags=decode_tags(holding.tags),
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
