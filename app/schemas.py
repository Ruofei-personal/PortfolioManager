from pydantic import BaseModel, EmailStr, Field


class AuthPayload(BaseModel):
    email: EmailStr
    password: str


class PortfolioPayload(BaseModel):
    name: str
    category: str = "股票"
    quantity: float
    cost: float
    tags: list[str] = Field(default_factory=list)
    note: str | None = None


class HoldingResponse(BaseModel):
    id: int
    name: str
    category: str
    quantity: float
    totalCost: float
    tags: list[str] = Field(default_factory=list)
    note: str | None = None
