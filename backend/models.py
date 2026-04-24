from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base


class Category(Base):

    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, unique=True)


class Transaction(Base):

    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    amount = Column(Float)

    type = Column(String)

    date = Column(Date)

    description = Column(String)

    category_id = Column(Integer, ForeignKey("categories.id"))

    category = relationship("Category")


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True)

    hashed_password = Column(String)

    is_active = Column(Boolean, default=True)