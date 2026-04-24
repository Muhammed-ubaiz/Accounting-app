from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import models
import schemas
import auth

from database import SessionLocal

router = APIRouter()


# DATABASE CONNECTION
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# SIGNUP ROUTE
@router.post("/signup")
def signup(user: schemas.UserCreate,
           db: Session = Depends(get_db)):

    existing_user = db.query(models.User)\
        .filter(models.User.email == user.email)\
        .first()

    if existing_user:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_password = auth.hash_password(user.password)

    new_user = models.User(
        email=user.email,
        hashed_password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Signup successful"}


# LOGIN ROUTE
@router.post("/login")
def login(user: schemas.UserLogin,
          db: Session = Depends(get_db)):

    db_user = db.query(models.User)\
        .filter(models.User.email == user.email)\
        .first()

    if not db_user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    if not auth.verify_password(
        user.password,
        db_user.hashed_password
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password"
        )

    token = auth.create_access_token(
        {"sub": db_user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# DEBUG ROUTE (VERY IMPORTANT FOR TESTING)
@router.get("/users")
def list_users(db: Session = Depends(get_db)):

    return db.query(models.User).all()