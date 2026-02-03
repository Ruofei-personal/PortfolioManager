from pydantic import BaseModel, EmailStr, Field


class AuthPayload(BaseModel):
    email: EmailStr
    password: str


class PortfolioPayload(BaseModel):
    name: str
    category: str = "股票"
    quantity: float
    cost: float
    currency: str = "USD"
    currentPrice: float | None = None
    riskLevel: str = "medium"
    strategy: str | None = None
    sentiment: str | None = None
    tags: list[str] = Field(default_factory=list)
    note: str | None = None


class HoldingResponse(BaseModel):
    id: int
    name: str
    category: str
    quantity: float
    totalCost: float
    currency: str
    currentPrice: float | None = None
    riskLevel: str
    strategy: str | None = None
    sentiment: str | None = None
    tags: list[str] = Field(default_factory=list)
    note: str | None = None
