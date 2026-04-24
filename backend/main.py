from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine

from routes import auth_routes
from routes import transactions
from routes import categories


Base.metadata.create_all(bind=engine)


app = FastAPI()


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    auth_routes.router,
    prefix="/auth",
    tags=["Authentication"]
)


app.include_router(
    transactions.router,
    prefix="/transactions",
    tags=["Transactions"]
)


app.include_router(
    categories.router,
    prefix="/categories",
    tags=["Categories"]
)