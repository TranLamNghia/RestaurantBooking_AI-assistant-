from fastapi import APIRouter, Depends
from typing import List, Optional
from sqlalchemy.orm import Session
from src.data_layer.database import get_db
from src.services.query import menu_service

router = APIRouter()

@router.get("/")
async def get_menu(
    category: Optional[str] = None, 
    type: Optional[str] = None,
    db: Session = Depends(get_db)
):

    items = await menu_service.get_all_menu_items(db, category=category, item_type=type)
    
    # Serialize SQLAlchemy objects into dictionaries manually
    serialized_items = []
    for item in items:
        serialized_items.append({
            "id": getattr(item, 'id', None),
            "name": getattr(item, 'name', None),
            "description": getattr(item, 'description', None),
            "price": float(item.price) if getattr(item, 'price', None) is not None else 0.0,
            "category": getattr(item, 'category', None)
        })
    
    return {
        "success": True,
        "count": len(serialized_items),
        "data": serialized_items
    }
