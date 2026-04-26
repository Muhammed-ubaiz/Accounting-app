import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from database import Base, engine
from routes import auth_routes, transactions, categories


app = FastAPI()


# ── CORS ──────────────────────────────────────────────────────────────────────
# Regex covers ALL *.vercel.app preview/production deployments automatically.
# Localhost origins are kept for local development.
CORS_ORIGIN_REGEX = (
    r"https://.*\.vercel\.app"
    r"|http://localhost:\d+"
    r"|http://127\.0\.0\.1:\d+"
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=CORS_ORIGIN_REGEX,
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