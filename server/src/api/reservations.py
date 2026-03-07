from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

router = APIRouter()

# Schema dữ liệu đầu vào cho yêu cầu tạo Reservation (PreOrder)
class ReservationCreate(BaseModel):
    customer_name: str
    email: Optional[str] = None
    phone: str
    reservation_date: str
    reservation_time: str
    guests: int
    preferred_space: Optional[str] = None
    occasion: Optional[str] = None
    special_notes: Optional[str] = None
    preorder_items: Optional[List[Dict[str, Any]]] = None # Danh sách món ăn JSON

class DepositCheckRequest(BaseModel):
    phone: str
    reservation_date: str

@router.post("/")
async def create_reservation(reservation: ReservationCreate):
    
    return {
        "success": True, 
        "message": "Đặt bàn thành công!",
        "data": reservation.dict() 
    }

@router.get("/availability")
async def check_availability(
    date: str = Query(..., description="Ngày đặt bàn (YYYY-MM-DD)"),
    time: str = Query(..., description="Giờ đặt bàn (HH:MM)"),
    guests: int = Query(..., description="Số lượng khách")
):
    """
    Kiểm tra xem nhà hàng có còn đủ sức chứa vào ngày/giờ này hay không.
    """
    # TODO: Gọi hàm từ tầng Service (booking_service.py)
    # is_available = await booking_service.check_availability(date, time, guests)
    
    # Mock data tạm thời
    is_available = True
    
    if is_available:
        return {"available": True, "message": "Nhà hàng vẫn còn bàn trống."}
    else:
        return {"available": False, "message": "Nhà hàng đã hết chỗ vào thời điểm này."}

@router.post("/check-deposit")
async def check_deposit_status(request: DepositCheckRequest):
    """
    Kiểm tra xem khách hàng có SDT này trong ngày hẹn này đã thanh toán tiền cọc (Deposit) chưa.
    (Dành cho các bàn V.I.P hoặc nhóm đông)
    """
    # TODO: Logic verify deposit từ Database
    
    # Mock data tạm thời
    has_deposited = True 
    
    return {
        "phone": request.phone,
        "date": request.reservation_date,
        "has_deposited": has_deposited,
        "message": "Đã nhận tiền cọc" if has_deposited else "Chưa thanh toán cọc"
    }
