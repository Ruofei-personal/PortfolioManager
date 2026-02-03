from pydantic import BaseModel, EmailStr


class AuthPayload(BaseModel):
    email: EmailStr
    password: str


class PortfolioPayload(BaseModel):
    name: str
    category: str = "股票"
    quantity: float
    cost: float


class HoldingResponse(BaseModel):
    id: int
    name: str
    category: str
    quantity: float
    totalCost: float
