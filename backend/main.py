import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from database import Base, engine
from routes import auth_routes, transactions, categories


app = FastAPI()


# ── CORS ──────────────────────────────────────────────────────────────────────
frontend_url = os.getenv("FRONTEND_URL", "")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://accounting-app-neon-one.vercel.app",
    "https://accounting-app-git-main-muhammed-ubaizs-projects.vercel.app",
]

if frontend_url:
    origins.extend(
        [url.strip() for url in frontend_url.split(",") if url.strip()]
    )

allowed_origins = list(dict.fromkeys(origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── DB Migration ───────────────────────────────────────────────────────────────
def ensure_transaction_user_id_column():
    try:
        inspector = inspect(engine)
        columns = [col["name"] for col in inspector.get_columns("transactions")]
        if "user_id" not in columns:
            with engine.begin() as conn:
                conn.execute(
                    text("ALTER TABLE transactions ADD COLUMN user_id INTEGER")
                )
            print("✅ user_id column added to transactions")
    except Exception as e:
        print(f"⚠️  Migration warning: {e}")


Base.metadata.create_all(bind=engine)
ensure_transaction_user_id_column()


# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
app.include_router(categories.router, prefix="/categories", tags=["Categories"])


# ── Health check ───────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok"}