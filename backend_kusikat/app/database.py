from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()
# Ganti dengan database MySQL dari XAMPP
DATABASE_URL = os.getenv("DATABASE_URL")

# Debug print untuk memastikan terbaca
if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL tidak ditemukan di .env")

print("✅ DATABASE_URL =", DATABASE_URL)

# HAPUS connect_args
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()