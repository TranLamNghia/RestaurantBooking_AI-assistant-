from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session
from src.data_layer.database import get_db
from src.ai_orchestrator.agent import handle_user_message, extract_form_details
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

@router.post("/extract")
async def extract_form(request: ChatRequest):
    """
    Parallel endpoint to extract structured form data from the user's message.
    """
    if not request.message:
        return {}
        
    extracted_data = await extract_form_details(request.message)
    return extracted_data

@router.post("/confirm")
async def confirm_reservation(request: ChatRequest):
    """
    Endpoint to finalize reservation and send confirmation email.
    Called when the guest types "Xác nhận" in the chat.
    """
    # TODO: Implement send email logic here
    # Example:
    # - Collect all form data from request
    # - Generate QR code and Booking ID (SOL-XXXXXX)
    # - Send confirmation email to guest
    # - Save reservation to database
    
    return {"status": "confirmed", "message": "Reservation confirmed successfully."}
