import smtplib
import os
from dotenv import load_dotenv

load_dotenv()

try:
    with smtplib.SMTP(os.getenv("EMAIL_HOST"), int(os.getenv("EMAIL_PORT"))) as server:
        server.starttls()
        server.login(os.getenv("EMAIL_USERNAME"), os.getenv("EMAIL_PASSWORD"))
        print("✅ Koneksi Mailtrap berhasil!")
except Exception as e:
    print("❌ Error:", e)