from pydantic import BaseModel, EmailStr


class AuthPayload(BaseModel):
    email: EmailStr
    password: str


class PortfolioPayload(BaseModel):
    name: str
    category: str = "股票"
    quantity: float
    cost: float
    currentPrice: float | None = None
    currency: str = "CNY"
    note: str | None = None
    tags: str | None = None


class HoldingResponse(BaseModel):
    id: int
    name: str
    category: str
    quantity: float
    totalCost: float
    currentPrice: float | None = None
    currency: str
    note: str | None = None
    tags: str | None = None
