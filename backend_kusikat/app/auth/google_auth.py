# app/auth/google_auth.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import requests
from urllib.parse import urlencode
from datetime import timedelta
import os
from dotenv import load_dotenv

from app.database import SessionLocal
from app.models import User
from app.auth.jwt_handler import create_access_token

load_dotenv()

router = APIRouter(prefix="/google", tags=["Google OAuth"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")  # Harus: http://localhost:8000/auth/google/callback
FRONTEND_URL = os.getenv("FRONTEND_URL")  # Harus: http://localhost:5173

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/login")
def google_login():
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }
    google_auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    return RedirectResponse(url=google_auth_url)

@router.get("/callback")
def google_callback(
    code: str | None = None,
    error: str | None = None,
    db: Session = Depends(get_db)
):
    # 🧩 1. Tangani kasus user menekan "Cancel" di halaman Google
    if error == "access_denied":
        # Arahkan balik ke halaman login frontend dengan pesan error
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=access_denied"
        )

    # 🧩 2. Tangani jika tidak ada code sama sekali
    if not code:
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=missing_code"
        )

    try:
        # ✅ Tukar authorization code dengan access token
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": REDIRECT_URI,
        }

        token_res = requests.post(token_url, data=token_data)
        token_res.raise_for_status()
        tokens = token_res.json()

        # ✅ Verifikasi ID token Google
        idinfo = id_token.verify_oauth2_token(
            tokens["id_token"], google_requests.Request(), GOOGLE_CLIENT_ID
        )

        google_id = idinfo["sub"]
        email = idinfo["email"]
        name = idinfo.get("name", email.split("@")[0])
        username = name.replace(" ", "") if name else email.split("@")[0]

        # ✅ Cari atau buat user di database
        user = db.query(User).filter(User.google_id == google_id).first()
        if not user:
            user = db.query(User).filter(User.email == email).first()
            if user:
                user.google_id = google_id
                user.username = username
            else:
                user = User(username=username, email=email, google_id=google_id)
                db.add(user)
            db.commit()
            db.refresh(user)

        # ✅ Buat JWT token
        access_token = create_access_token(
            data={"sub": user.email, "id": user.id},
            expires_delta=timedelta(minutes=60)
        )

        # ✅ Redirect ke frontend
        return RedirectResponse(
            url=f"{FRONTEND_URL}/auth/callback?access_token={access_token}"
        )

    except Exception as e:
        print("Google login error:", str(e))
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=google_failed"
        )


    except Exception as e:
        print("Google login error:", str(e))
        raise HTTPException(status_code=400, detail="Gagal login dengan Google")