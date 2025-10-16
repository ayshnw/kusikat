from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from app.database import SessionLocal, engine, Base
from app.models import User

# -----------------------------
# Password hashing setup
# -----------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    """Mengubah password biasa menjadi hash."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    """Memverifikasi password login dengan hash di database."""
    return pwd_context.verify(plain_password, hashed_password)

# -----------------------------
# Buat tabel di database
# -----------------------------
Base.metadata.create_all(bind=engine)

# -----------------------------
# Inisialisasi FastAPI
# -----------------------------
app = FastAPI()

# -----------------------------
# Middleware CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# DB Session dependency
# -----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------------------
# Request Schemas
# -----------------------------
class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    phone_number: str

class LoginRequest(BaseModel):
    username: str
    password: str

# -----------------------------
# REGISTER Endpoint
# -----------------------------
@app.post("/api/register")
def register_user(request: RegisterRequest, db: Session = Depends(get_db)):
    user_exist = db.query(User).filter(
        (User.email == request.email) | (User.username == request.username)
    ).first()

    if user_exist:
        raise HTTPException(status_code=400, detail="Username atau Email sudah terdaftar")

    try:
        hashed_pw = hash_password(request.password)
        new_user = User(
            username=request.username,
            email=request.email,
            password=hashed_pw,
            phone_number=request.phone_number,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "Registrasi berhasil!",
            "user": {"id": new_user.id, "username": new_user.username}
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# -----------------------------
# LOGIN Endpoint
# -----------------------------
@app.post("/api/login")
def login_user(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == request.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Username tidak ditemukan")

    if not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Password salah")

    return {
        "message": "Login berhasil!",
        "user": {"id": user.id, "username": user.username, "email": user.email}
    }
# -----------------------------
# GET: Ambil semua user
# -----------------------------
@app.get("/api/users")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "phone_number": user.phone_number,
            "google_id": user.google_id
        }
        for user in users
    ]


# -----------------------------
# GET: Ambil user berdasarkan ID
# -----------------------------
@app.get("/api/users/{user_id}")
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "phone_number": user.phone_number,
        "google_id": user.google_id
    }


# -----------------------------
# PUT: Update data user
# -----------------------------
class UpdateUserRequest(BaseModel):
    username: str | None = None
    email: str | None = None
    phone_number: str | None = None
    password: str | None = None

@app.put("/api/users/{user_id}")
def update_user(user_id: int, request: UpdateUserRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")

    # Update field yang dikirim
    if request.username:
        user.username = request.username
    if request.email:
        user.email = request.email
    if request.phone_number:
        user.phone_number = request.phone_number
    if request.password:
        user.password = hash_password(request.password)

    db.commit()
    db.refresh(user)

    return {
        "message": "Data user berhasil diperbarui",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "phone_number": user.phone_number
        }
    }


# -----------------------------
# DELETE: Hapus user
# -----------------------------
@app.delete("/api/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")

    db.delete(user)
    db.commit()
    return {"message": f"User dengan ID {user_id} berhasil dihapus"}
