# app/schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from pydantic import BaseModel

# -----------------------------------
# Edit Password and Phone Schemas
# -----------------------------------
class SetPasswordRequest(BaseModel):
    new_password: str

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class UpdatePhoneRequest(BaseModel):
    phone_number: str
# -----------------------------------
# Forgot Password Schemas
# -----------------------------------
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    new_password: str

# -----------------------------------
# User Auth Schemas
# -----------------------------------
class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    phone_number: str

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    phone_number: Optional[str] = None
    model_config = {"from_attributes": True}