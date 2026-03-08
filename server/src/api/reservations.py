from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from src.data_layer.database import get_db
from src.services import execution_service, query_service
import datetime

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
async def create_reservation(reservation: ReservationCreate, db: Session = Depends(get_db)):
    """
    Tiếp nhận Form đặt bàn (Kèm theo thông tin customer và preorder_items nếu có).
    Lưu vào Database.
    """
    customer_data = {
        "name": reservation.customer_name,
        "email": reservation.email,
        "phone": reservation.phone
    }
    
    reservation_data = {
        "reservation_date": reservation.reservation_date,
        "reservation_time": reservation.reservation_time,
        "guests": reservation.guests,
        "preferred_space": reservation.preferred_space,
        "occasion": reservation.occasion,
        "special_notes": reservation.special_notes
    }
    
    result = await execution_service.execute_reservation_booking(
        db=db,
        customer_data=customer_data,
        reservation_data=reservation_data,
        preorder_items=reservation.preorder_items
    )
    
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("message"))
        
    return result

@router.get("/availability")
async def check_availability(
    date: str = Query(..., description="Ngày đặt bàn (YYYY-MM-DD)"),
    time: str = Query(..., description="Giờ đặt bàn (HH:MM)"),
    guests: int = Query(..., description="Số lượng khách"),
    db: Session = Depends(get_db)
):
    """
    Kiểm tra xem nhà hàng có còn đủ sức chứa vào ngày/giờ này hay không.
    """
    try:
        res_day = datetime.datetime.strptime(date, "%Y-%m-%d").date()
        res_time = datetime.datetime.strptime(time, "%H:%M").time()
    except ValueError:
        raise HTTPException(status_code=400, detail="Định dạng ngày/giờ không hợp lệ. Ngày: YYYY-MM-DD, Giờ: HH:MM")

    availability_result = await query_service.query_table_availability(db, res_day, res_time, guests)
    
    if availability_result.get("is_available"):
        return {"available": True, "message": "Nhà hàng vẫn còn bàn trống."}
    else:
        return {"available": False, "message": "Nhà hàng đã hết chỗ vào thời điểm này."}

@router.post("/check-deposit")
async def check_deposit_status(request: DepositCheckRequest, db: Session = Depends(get_db)):
    """
    Kiểm tra xem khách hàng có SDT này trong ngày hẹn này đã thanh toán tiền cọc (Deposit) chưa.
    (Dành cho các bàn V.I.P hoặc nhóm đông)
    """
    has_deposited = await query_service.query_deposit_status(
        db=db, 
        identifier=request.phone
    )
    
    return {
        "phone": request.phone,
        "date": request.reservation_date,
        "has_deposited": has_deposited,
        "message": "Khách này đã tồn tại đơn hàng ngày hôm nay trong hệ thống." if has_deposited else "Chưa có thông tin đặt cọc/đơn hàng."
    }
