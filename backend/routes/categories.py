from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models
import schemas

from database import SessionLocal
from auth import verify_token

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post("/")
def create_category(category: schemas.CategoryCreate,
                    db: Session = Depends(get_db),
                    user=Depends(verify_token)):

    new_category = models.Category(
        name=category.name
    )

    db.add(new_category)

    db.commit()

    db.refresh(new_category)

    return new_category


@router.get("/")
def get_categories(db: Session = Depends(get_db),
                   user=Depends(verify_token)):

    return db.query(models.Category).all()