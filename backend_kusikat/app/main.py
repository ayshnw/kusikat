from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import bcrypt
from jose import JWTError, jwt
from datetime import timedelta, datetime
import os
from dotenv import load_dotenv
import smtplib
import random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.database import SessionLocal, engine, Base
from app.models import User, PasswordResetToken
from app.auth.google_auth import router as google_auth
from app.auth.jwt_handler import create_access_token
from app.schemas import (
    RegisterRequest,
    LoginRequest,
    ForgotPasswordRequest,
    VerifyOTPRequest,
    ResetPasswordRequest,
    SetPasswordRequest,
    ChangePasswordRequest,
    UpdatePhoneRequest
)

load_dotenv()

app = FastAPI()
app.include_router(google_auth, prefix="/auth")
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    payload = verify_token(credentials.credentials)
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token tidak valid")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")
    return user

def verify_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Token tidak valid")

def hash_password(password: str) -> str:
    if len(password) > 72:
        password = password[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if len(plain_password) > 72:
        plain_password = plain_password[:72]
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )

# === ROUTES ===

@app.post("/api/register")
def register_user(request: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter((User.email == request.email) | (User.username == request.username)).first():
        raise HTTPException(400, "Username atau Email sudah terdaftar")
    try:
        user = User(
            username=request.username,
            email=request.email,
            password=hash_password(request.password),
            phone_number=request.phone_number,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return {"message": "Registrasi berhasil!", "user": {"id": user.id, "username": user.username}}
    except Exception as e:
        db.rollback()
        raise HTTPException(500, f"Error: {str(e)}")

@app.post("/api/login")
def login_user(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == request.username).first()
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(401, "Username atau password salah")
    
    token = create_access_token(
        data={"sub": user.email, "id": user.id},
        expires_delta=timedelta(minutes=60)
    )
    return {
        "message": "Login berhasil",
        "access_token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }

@app.get("/api/me")
def get_me(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    payload = verify_token(credentials.credentials)
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(401, "Token tidak valid")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User tidak ditemukan")
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "phone_number": user.phone_number,
        "google_id": user.google_id,
        "has_password": user.password is not None
    }

@app.get("/")
def root():
    return {"message": "Backend ResQ Freeze berjalan!"}

# === FORGOT PASSWORD DENGAN OTP ===

@app.post("/api/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        return {"message": "Jika email terdaftar, kami telah mengirim kode OTP."}

    otp = str(random.randint(100000, 999999))
    expires = datetime.utcnow() + timedelta(minutes=5)

    token_entry = PasswordResetToken(
        email=request.email,
        otp=otp,
        expires_at=expires
    )
    db.add(token_entry)
    db.commit()

    try:
        msg = MIMEMultipart()
        msg["From"] = "no-reply@resqfreeze.com"
        msg["To"] = request.email
        msg["Subject"] = "Kode OTP - Reset Password"

        body = f"""
Halo {user.username},

Kode OTP Anda untuk reset password adalah:

{otp}

Kode ini berlaku selama 5 menit.
        """.strip()

        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(os.getenv("EMAIL_HOST"), int(os.getenv("EMAIL_PORT"))) as server:
            server.starttls()
            server.login(os.getenv("EMAIL_USERNAME"), os.getenv("EMAIL_PASSWORD"))
            server.send_message(msg)

    except Exception as e:
        print("Gagal kirim email:", e)

    return {"message": "Jika email terdaftar, kami telah mengirim kode OTP."}

@app.post("/api/verify-otp")
def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    token_entry = db.query(PasswordResetToken).filter(
        PasswordResetToken.email == request.email,
        PasswordResetToken.otp == request.otp
    ).first()

    if not token_entry:
        raise HTTPException(400, "OTP salah atau tidak valid")

    if datetime.utcnow() > token_entry.expires_at.replace(tzinfo=None):
        db.delete(token_entry)
        db.commit()
        raise HTTPException(400, "OTP sudah kadaluarsa")

    db.delete(token_entry)
    db.commit()
    return {"success": True}

@app.post("/api/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(404, "User tidak ditemukan")

    user.password = hash_password(request.new_password)
    db.commit()
    return {"message": "Password berhasil diubah!"}

# --- 1. Atur Password (untuk user Google yang belum punya password) ---
@app.post("/api/user/set-password")
def set_password(
    request: SetPasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.password is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password sudah diatur. Gunakan fitur 'Ganti Password'."
        )
    # Set password baru
    current_user.password = hash_password(request.new_password)
    db.commit()
    return {"message": "Password berhasil diatur"}

# --- 2. Ganti Password (hanya jika sudah punya password) ---
@app.put("/api/user/password")
def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.password is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Akun ini belum memiliki password. Silakan atur password terlebih dahulu."
        )
    if not verify_password(request.old_password, current_user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password lama salah."
        )
    current_user.password = hash_password(request.new_password)
    db.commit()
    return {"message": "Password berhasil diubah"}

# --- 3. Ubah Nomor Telepon (untuk semua user) ---
@app.put("/api/user/phone")
def update_phone(
    request: UpdatePhoneRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Opsional: validasi format nomor HP Indonesia
    # Misal: harus angka, minimal 10 digit, dll.
    current_user.phone_number = request.phone_number
    db.commit()
    return {"message": "Nomor telepon berhasil diperbarui"}
