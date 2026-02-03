import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select

from app.db import get_db
from app.models import Session, User
from app.schemas import AuthPayload

SESSION_TTL_DAYS = 7
MIN_PASSWORD_LENGTH = 6

router = APIRouter()


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100_000)
    return f"{salt}${hashed.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        salt, hashed = stored.split("$", 1)
    except ValueError:
        return False
    new_hash = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100_000)
    return secrets.compare_digest(new_hash.hex(), hashed)


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def normalize_email(email: str) -> str:
    return email.strip().lower()


def extract_token(request: Request) -> str:
    auth_header = request.headers.get("Authorization", "")
    return auth_header.replace("Bearer ", "").strip()


def cleanup_expired_sessions(db) -> None:
    expired_sessions = db.execute(select(Session).where(Session.expires_at < now_utc())).scalars().all()
    for session_row in expired_sessions:
        db.delete(session_row)
    if expired_sessions:
        db.commit()


def create_session(db, user: User) -> str:
    cleanup_expired_sessions(db)
    token = secrets.token_urlsafe(32)
    expires_at = now_utc() + timedelta(days=SESSION_TTL_DAYS)
    session = Session(user_id=user.id, token=token, expires_at=expires_at, created_at=now_utc())
    db.add(session)
    db.commit()
    return token


def get_user_by_session(db, token: str) -> Optional[User]:
    session_row = db.execute(select(Session).where(Session.token == token)).scalar_one_or_none()
    if not session_row:
        return None
    if session_row.expires_at < now_utc():
        db.delete(session_row)
        db.commit()
        return None
    return session_row.user


def require_user(request: Request, db=Depends(get_db)) -> User:
    token = extract_token(request)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    user = get_user_by_session(db, token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return user


@router.post("/api/register")
def register(payload: AuthPayload, db=Depends(get_db)):
    if len(payload.password) < MIN_PASSWORD_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Password must be at least {MIN_PASSWORD_LENGTH} characters.",
        )
    email = normalize_email(payload.email)
    existing = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered.")
    user = User(email=email, password_hash=hash_password(payload.password), created_at=now_utc())
    db.add(user)
    db.commit()
    return {"message": "registered"}


@router.post("/api/login")
def login(payload: AuthPayload, db=Depends(get_db)):
    email = normalize_email(payload.email)
    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")
    token = create_session(db, user)
    return {"token": token, "email": email}


@router.get("/api/profile")
def profile(user: User = Depends(require_user)):
    return {"email": user.email}


@router.post("/api/logout")
def logout(request: Request, user: User = Depends(require_user), db=Depends(get_db)):
    token = extract_token(request)
    if token:
        session_row = db.execute(select(Session).where(Session.token == token)).scalar_one_or_none()
        if session_row:
            db.delete(session_row)
            db.commit()
    return {"message": "logged out"}
