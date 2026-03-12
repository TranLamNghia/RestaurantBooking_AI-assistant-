from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session
from src.data_layer.database import get_db
from src.ai_orchestrator.agent import handle_user_message
from typing import Optional
import uuid

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    session_id: str

@router.post("/")
async def chat_with_ai(request: ChatRequest, db: Session = Depends(get_db)):
    if not request.message:
        raise HTTPException(status_code=400, detail="Message is required")
        
    session_id = request.session_id or str(uuid.uuid4())
    
    reply_text = await handle_user_message(db=db, session_id=session_id, message=request.message)
    
    return ChatResponse(
        reply=reply_text,
        session_id=session_id
    )
