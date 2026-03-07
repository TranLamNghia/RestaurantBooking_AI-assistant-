from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.reservations import router as reservations_router
from src.api.menu import router as menu_router
from src.api.router import router as chat_router # if you still want to keep the chat endpoint

app = FastAPI(title="Spice of Life AI Agent API")

# Cấu hình CORS để Frontend (React) có thể gọi được API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Trong thực tế nên sửa lại thành domain của Frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các Router
app.include_router(reservations_router, prefix="/api/reservations", tags=["Reservations"])
app.include_router(menu_router, prefix="/api/menu", tags=["Menu"])
app.include_router(chat_router, prefix="/api/chat", tags=["AI Chat"])

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Spice of Life API is running!"}
