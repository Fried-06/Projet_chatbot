from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.bd.database import get_db
from app.schemas.chat import UserCreate, UserLogin, UserResponse, Token
from app.services.auth_service import register_user, login_user

router = APIRouter(prefix="/api/auth")

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    return register_user(db, user.username, user.nom, user.prenom, user.email, user.password)

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    return login_user(db, user.email, user.password)