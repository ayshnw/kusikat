import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

MAILTRAP_USERNAME = os.getenv("MAILTRAP_USERNAME")
MAILTRAP_PASSWORD = os.getenv("MAILTRAP_PASSWORD")
MAILTRAP_HOST = os.getenv("MAILTRAP_HOST")
MAILTRAP_PORT = os.getenv("MAILTRAP_PORT")

def send_otp_email(to_email: str, otp: str):
    subject = "Kusikat - OTP Reset Password"
    body = f"""
    Halo!
    
    Kode OTP kamu adalah: {otp}
    Berlaku selama 5 menit.
    
    Jangan berikan kode ini ke siapa pun.
    
    Salam,
    Tim Kusikat 🐱
    """

    msg = MIMEMultipart()
    msg["From"] = "Kusikat_Support"
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(MAILTRAP_HOST, MAILTRAP_PORT) as server:
            server.starttls()
            server.login(MAILTRAP_USERNAME, MAILTRAP_PASSWORD)
            server.send_message(msg)
            print(f"✅ OTP sent successfully to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send OTP: {e}")
