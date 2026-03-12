from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.reservations import router as reservations_router
from src.api.menu import router as menu_router
from src.api.chat import router as chat_router
from src.data_layer.database import engine, Base
from src.data_layer.models import *

app = FastAPI(title="Spice of Life AI Agent API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router
app.include_router(reservations_router, prefix="/api/reservations", tags=["Reservations"])
app.include_router(menu_router, prefix="/api/menu", tags=["Menu"])
app.include_router(chat_router, prefix="/api/ai/chat", tags=["AI Chat"])

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Spice of Life API is running!"}
