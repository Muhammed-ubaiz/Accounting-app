from pydantic import BaseModel, EmailStr
from datetime import date


# CATEGORY SCHEMA
class CategoryCreate(BaseModel):

    name: str


# TRANSACTION SCHEMA
class TransactionCreate(BaseModel):

    amount: float

    type: str   # income / expense

    date: date

    description: str

    category_id: int


# USER SIGNUP SCHEMA
class UserCreate(BaseModel):

    email: EmailStr   # validates email automatically

    password: str


# USER LOGIN SCHEMA
class UserLogin(BaseModel):

    email: EmailStr

    password: str


# TOKEN RESPONSE SCHEMA (optional but recommended)
class Token(BaseModel):

    access_token: str

    token_type: str