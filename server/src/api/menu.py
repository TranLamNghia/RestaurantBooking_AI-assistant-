from fastapi import APIRouter, Depends
from typing import List, Optional
from sqlalchemy.orm import Session
from src.data_layer.database import get_db
from src.services import menu_service

router = APIRouter()

@router.get("/")
async def get_menu(
    category: Optional[str] = None, 
    type: Optional[str] = None,
    db: Session = Depends(get_db)
):

    items = await menu_service.get_all_menu_items(db, category=category, item_type=type)
    
    return {
        "success": True,
        "count": len(items),
        "data": items
    }
