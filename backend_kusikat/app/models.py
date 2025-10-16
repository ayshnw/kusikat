from sqlalchemy import Column, Integer, String
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(120), unique=True, index=True)
    password = Column(String(255), nullable=True)
    phone_number = Column(String(20), nullable=True)
    google_id = Column(String(255), unique=True, nullable=True)
