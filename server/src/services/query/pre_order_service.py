from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from src.data_layer.models.pre_order import PreOrder
from src.data_layer.models.menu import Menu
from src.data_layer.models.customer import Customer
from src.infrastructure.email_service import email_service
from typing import List, Optional, Dict, Any
import datetime

MAX_CAPACITY = 50 

async def query_table_availability(
    db: Session, 
    reservation_day: datetime.date, 
    reservation_time: Optional[datetime.time] = None, 
    guests: int = 1
) -> Dict[str, Any]:

    # query -> datetime
    if reservation_time:
        total_booked = db.query(func.sum(PreOrder.guests)).filter(
            PreOrder.reservation_day == reservation_day,
            PreOrder.reservation_time == reservation_time
        ).scalar() or 0
        
        is_available = (total_booked + guests <= MAX_CAPACITY)
        return {
            "query_type": "exact_time",
            "is_available": is_available,
            "remaining_capacity": MAX_CAPACITY - total_booked,
            "message": f"Lúc {reservation_time.strftime('%H:%M')} ngày {reservation_day} {'vẫn còn' if is_available else 'đã hết'} bàn trống."
        }
    else:
        # query -> date
        booked_by_time = db.query(
            PreOrder.reservation_time, 
            func.sum(PreOrder.guests)
        ).filter(
            PreOrder.reservation_day == reservation_day
        ).group_by(PreOrder.reservation_time).all()
        
        fully_booked_times = []
        for time_val, total_g in booked_by_time:
            if total_g + guests > MAX_CAPACITY:
                fully_booked_times.append(time_val.strftime("%H:%M"))
                
        return {
            "query_type": "entire_day",
            "is_available": True, 
            "fully_booked_times": fully_booked_times,
            "message": f"Ngày {reservation_day} các khung giờ sau đã được đặt kín: {', '.join(fully_booked_times) if fully_booked_times else 'Chưa có khung giờ nào bị full'}."
        }

async def query_deposit_status(db: Session, identifier: str) -> bool:
    """
    Query deposit/reservation status by either Phone OR Email.
    Chỉ lấy các đơn hàng trong tương lai (lớn hơn hoặc bằng ngày/giờ hiện tại).
    Trường hợp tìm thấy, sẽ bắn mail xác nhận.
    """
    # 1. Get customer by phone or email
    customer = db.query(Customer).filter(
        or_(
            Customer.phone == identifier,
            Customer.email == identifier
        )
    ).first()
    
    if not customer:
        return False
        
    # Get current time
    now = datetime.datetime.now()
    current_date = now.date()
    current_time = now.time()
        
    # 2. Get PreOrder of this customer, but exclude past orders
    future_preorder = db.query(PreOrder).filter(
        PreOrder.customer_id == customer.id,
        or_(
            PreOrder.reservation_day > current_date,
            (
                (PreOrder.reservation_day == current_date) & 
                (PreOrder.reservation_time > current_time)
            )
        )
    ).order_by(PreOrder.reservation_day, PreOrder.reservation_time).first()
    
    # 3. Nếu có đơn trong tương lai, bắn Email và trả về True
    if future_preorder:
        if customer.email:
            reservation_day_str = future_preorder.reservation_day.strftime('%d/%m/%Y')
            reservation_time_str = future_preorder.reservation_time.strftime('%H:%M')
            
            # Kiểm tra xem có đặt trước thức ăn không (dựa trên quan hệ menus)
            has_food = "Có" if future_preorder.menus and len(future_preorder.menus) > 0 else "Không"
            
            # Lấy thông tin khu vực bàn
            pref_space = future_preorder.preferred_space if future_preorder.preferred_space else "Tự do"
            
            await email_service.send_reservation_confirmation(
                to_email=customer.email,
                customer_name=customer.name,
                customer_phone=customer.phone,
                reservation_day=reservation_day_str,
                reservation_time=reservation_time_str,
                preferred_space=pref_space,
                has_preorder=has_food,
                booking_id=future_preorder.id
            )
        return True
        
    return False
