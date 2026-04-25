from fastapi import APIRouter, Depends, HTTPException
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


def get_current_user(db: Session, token_payload):
    user_email = token_payload.get("sub")

    if not user_email:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    current_user = db.query(models.User)\
        .filter(models.User.email == user_email)\
        .first()

    if not current_user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return current_user


@router.post("/")
def create_transaction(transaction: schemas.TransactionCreate,
                       db: Session = Depends(get_db),
                       user=Depends(verify_token)):

    current_user = get_current_user(db, user)

    new_transaction = models.Transaction(
        **transaction.dict(),
        user_id=current_user.id
    )

    db.add(new_transaction)

    db.commit()

    db.refresh(new_transaction)

    return new_transaction


@router.get("/")
def get_transactions(db: Session = Depends(get_db),
                     user=Depends(verify_token)):

    current_user = get_current_user(db, user)

    return db.query(models.Transaction)\
        .filter(models.Transaction.user_id == current_user.id)\
        .all()


@router.put("/{transaction_id}")
def update_transaction(transaction_id: int,
                       transaction: schemas.TransactionCreate,
                       db: Session = Depends(get_db),
                       user=Depends(verify_token)):

    current_user = get_current_user(db, user)

    db_transaction = db.query(models.Transaction)\
        .filter(
            models.Transaction.id == transaction_id,
            models.Transaction.user_id == current_user.id
        )\
        .first()

    if not db_transaction:

        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    db_transaction.amount = transaction.amount
    db_transaction.type = transaction.type
    db_transaction.date = transaction.date
    db_transaction.description = transaction.description
    db_transaction.category_id = transaction.category_id

    db.commit()
    db.refresh(db_transaction)

    return db_transaction


@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int,
                       db: Session = Depends(get_db),
                       user=Depends(verify_token)):

    current_user = get_current_user(db, user)

    db_transaction = db.query(models.Transaction)\
        .filter(
            models.Transaction.id == transaction_id,
            models.Transaction.user_id == current_user.id
        )\
        .first()

    if not db_transaction:

        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    db.delete(db_transaction)
    db.commit()

    return {"message": "Transaction deleted"}


@router.get("/summary")
def get_summary(db: Session = Depends(get_db),
                user=Depends(verify_token)):

    current_user = get_current_user(db, user)

    income = db.query(models.Transaction)\
        .filter(
            models.Transaction.type == "income",
            models.Transaction.user_id == current_user.id
        ).all()

    expense = db.query(models.Transaction)\
        .filter(
            models.Transaction.type == "expense",
            models.Transaction.user_id == current_user.id
        ).all()

    total_income = sum(t.amount for t in income)

    total_expense = sum(t.amount for t in expense)

    return {
        "income": total_income,
        "expense": total_expense,
        "balance": total_income - total_expense
    }
