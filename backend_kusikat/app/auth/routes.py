from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from app import models, schemas
from app.database import SessionLocal
from jose import jwt

SECRET_KEY = "kusikat_secret"
ALGORITHM = "HS256"

router = APIRouter(prefix="/api/auth", tags=["Auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_email = db.query(models.User).filter(models.User.email == user.email).first()
    existing_username = db.query(models.User).filter(models.User.username == user.username).first()

    if existing_email:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    if existing_username:
        raise HTTPException(status_code=400, detail="Username sudah digunakan")

    hashed_pw = bcrypt.hash(user.password)
    new_user = models.User(
        username=user.username,
        email=user.email,
        password=hashed_pw,
        phone_number=user.phone_number
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Register berhasil", "user": new_user.email}

@router.post("/login")
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not bcrypt.verify(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Email atau password salah")

    token = jwt.encode({"sub": db_user.email}, SECRET_KEY, algorithm=ALGORITHM)
    return {"message": "Login berhasil", "token": token}
