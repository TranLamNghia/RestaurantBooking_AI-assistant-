from fastapi import APIRouter
from typing import List, Optional

router = APIRouter()

@router.get("/")
async def get_menu(category: Optional[str] = None, type: Optional[str] = None):
    """
    Lấy danh sách các món ăn (food) và đồ uống (beverage) từ bảng Menu.
    Có thể lọc theo loại (type) hoặc danh mục (category) nếu FrontEnd cần.
    """
    # TODO: Gọi hàm từ tầng Service để GET Database
    
    # Mock data tĩnh tạm thời dựa trên file SQL lúc nãy:
    mock_menu = [
        {"id": "f-s1", "name": "Crispy Eggplant", "price": 14.00, "category": "Starters", "type": "food"},
        {"id": "f-m1", "name": "NZ Ribeye 300g", "price": 46.00, "category": "Centrepiece", "type": "food"},
        {"id": "b-c1", "name": "Old Fashioned", "price": 18.00, "category": "Classics", "type": "beverage"},
    ]
    
    # Giả lập chức năng lọc Query Params
    if type:
        mock_menu = [item for item in mock_menu if item["type"] == type]
    if category:
        mock_menu = [item for item in mock_menu if item["category"].lower() == category.lower()]
        
    return {
        "success": True,
        "count": len(mock_menu),
        "data": mock_menu
    }
