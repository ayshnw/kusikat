from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random, string
from passlib.context import CryptContext

from app.database import SessionLocal
from app.models import User, PasswordResetToken
from app.schemas import ForgotPasswordRequest, VerifyOTPRequest, ResetPasswordRequest
from app.utils.mail import send_otp_email

# ------------------------------------
# Router Setup
# ------------------------------------
router = APIRouter(tags=["Forgot Password"])

# ------------------------------------
# Utility
# ------------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def generate_otp():
    """Generate 6 digit OTP"""
    return ''.join(random.choices(string.digits, k=6))

# ------------------------------------
# Forgot Password Step 1: Send OTP
# ------------------------------------
@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email tidak terdaftar")

    otp = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=5)

    # Simpan token baru (hapus token lama jika ada)
    db.query(PasswordResetToken).filter(PasswordResetToken.email == request.email).delete()
    reset_token = PasswordResetToken(email=request.email, otp=otp, expires_at=expires_at)
    db.add(reset_token)
    db.commit()

    send_otp_email(request.email, otp)
    return {"message": "OTP telah dikirim ke email kamu"}

# ------------------------------------
# Forgot Password Step 2: Verify OTP
# ------------------------------------
@router.post("/verify-otp")
def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    token = db.query(PasswordResetToken).filter(
        PasswordResetToken.email == request.email,
        PasswordResetToken.otp == request.otp
    ).first()

    if not token:
        raise HTTPException(status_code=400, detail="OTP tidak valid")

    if token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP telah kadaluarsa")

    return {"message": "OTP valid"}

# ------------------------------------
# Forgot Password Step 3: Reset Password
# ------------------------------------
@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    token = db.query(PasswordResetToken).filter(
        PasswordResetToken.email == request.email,
        PasswordResetToken.otp == request.otp
    ).first()

    if not token:
        raise HTTPException(status_code=400, detail="OTP tidak valid")

    if token.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP telah kadaluarsa")

    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")

    # 🔒 Penting: hash password sebelum disimpan
    user.password = hash_password(request.new_password)
    db.commit()

    # (Opsional) hapus token setelah berhasil reset
    db.delete(token)
    db.commit()

    return {"message": "Password berhasil direset"}
