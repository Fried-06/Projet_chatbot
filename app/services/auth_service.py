from sqlalchemy.orm import Session
from app.models.models import User
from app.core.security import hash_password, verify_password, create_access_token
from fastapi import HTTPException

def register_user(db: Session, username: str,nom:str, prenom:str, email: str, password: str):
    # Vérifier si l'utilisateur existe déjà
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    
    user = User(
        username=username,
        nom=nom,
        prenom=prenom,
        email=email,
        password=hash_password(password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def login_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}