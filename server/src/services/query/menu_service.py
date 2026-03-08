from sqlalchemy.orm import Session
from src.data_layer.models.menu import Menu
from typing import List, Optional

async def get_all_menu_items(db: Session, category: Optional[str] = None, item_type: Optional[str] = None) -> List[Menu]:
    """
    Get menu from DB based on category or type (food/beverage)
    """
    query = db.query(Menu)
    
    if category:
        query = query.filter(Menu.category == category)
    if item_type:
        query = query.filter(Menu.type == item_type)
        
    return query.all()
