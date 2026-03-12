from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from src.data_layer.database import get_db
from src.services.excution import pre_order_service as execution_service
from src.services.query import pre_order_service as query_service
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
    Receive table reservation forms (with customer information and preorder_items if any).
    Save to Database.
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
    date: Optional[str] = Query(None, description="Date (YYYY-MM-DD)"),
    time: Optional[str] = Query(None, description="Time (HH:MM)"),
    preferred_space: Optional[str] = Query(None, description="Preferred space"),
    db: Session = Depends(get_db)
):
    """
    Check if the restaurant has enough capacity on the given date and time.
    Can accept 1, 2, or 3 parameters.
    """
    res_day, res_time = None, None
    try:
        if date:
            res_day = datetime.datetime.strptime(date, "%Y-%m-%d").date()
        if time:
            res_time = datetime.datetime.strptime(time, "%H:%M").time()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date or time format. Date: YYYY-MM-DD, Time: HH:MM")

    availability_result = await query_service.query_table_availability(
        db=db, 
        reservation_day=res_day, 
        reservation_time=res_time, 
        preferred_space=preferred_space
    )
    
    return availability_result

@router.post("/check-deposit")
async def check_deposit_status(request: DepositCheckRequest, db: Session = Depends(get_db)):
    """
    Check if the customer has made a deposit for the given phone number and date.
    (Reserved for VIP tables or large groups)
    """
    has_deposited = await query_service.query_deposit_status(
        db=db, 
        identifier=request.phone
    )
    
    return {
        "phone": request.phone,
        "date": request.reservation_date,
        "has_deposited": has_deposited,
        "message": "Customer has made a deposit for this phone number and date." if has_deposited else "No deposit found for this phone number and date."
    }
