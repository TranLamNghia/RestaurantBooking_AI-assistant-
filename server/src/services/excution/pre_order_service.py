from sqlalchemy.orm import Session
from src.data_layer.models.pre_order import PreOrder
from src.data_layer.models.customer import Customer
from src.services.query_service import query_table_availability
from src.infrastructure.email_service import email_service
from typing import Dict, Any, List, Optional
import datetime

async def execute_reservation_booking(
    db: Session, 
    customer_data: Dict[str, Any], 
    reservation_data: Dict[str, Any],
    preorder_items: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    # 1. Input validation
    if not customer_data.get('phone') or not customer_data.get('name'):
        return {"success": False, "message": "Thiếu thông tin bắt buộc của khách hàng (Tên, SĐT)."}
        
    if not reservation_data.get('reservation_date') or not reservation_data.get('reservation_time') or not reservation_data.get('guests'):
        return {"success": False, "message": "Thiếu thông tin đặt bàn (Ngày, Giờ, Số khách)."}

    # Validate data
    try:
        res_day = datetime.datetime.strptime(reservation_data['reservation_date'], "%Y-%m-%d").date()
        res_time = datetime.datetime.strptime(reservation_data['reservation_time'], "%H:%M").time()
        guests = int(reservation_data['guests'])
    except ValueError:
        return {"success": False, "message": "Sai định dạng ngày giờ. Ngày: YYYY-MM-DD, Giờ: HH:MM"}

    # Check table availability
    availability = await query_table_availability(db, res_day, res_time, guests)
    if not availability.get("is_available"):
        return {"success": False, "message": "Nhà hàng đã không còn đủ chỗ trống trong khung giờ này."}

    # Transaction Database
    try:
        phone = customer_data.get('phone')
        customer = db.query(Customer).filter(Customer.phone == phone).first()
        
        if not customer:
            customer = Customer(
                name=customer_data.get('name'),
                email=customer_data.get('email', ''),
                phone=phone
            )
            db.add(customer)
            db.flush()

        new_preorder = PreOrder(
            customer_id=customer.id,
            reservation_day=res_day,
            reservation_time=res_time,
            guests=guests,
            preferred_space=reservation_data.get('preferred_space', 'No preference'),
            occasion=reservation_data.get('occasion'),
            special_notes=reservation_data.get('special_notes'),
            preorder_items=preorder_items
        )
        
        db.add(new_preorder)
        db.commit()
        db.refresh(new_preorder)
        
        # Gửi email yêu cầu đặt cọc nếu khách có cung cấp email
        if customer.email:
            reservation_day_str = res_day.strftime('%d/%m/%Y')
            reservation_time_str = res_time.strftime('%H:%M')
            await email_service.send_pending_booking_email(
                to_email=customer.email,
                customer_name=customer.name,
                reservation_day=reservation_day_str,
                reservation_time=reservation_time_str,
                preferred_space=new_preorder.preferred_space,
                guests=guests,
                booking_id=new_preorder.id
            )

        return {
            "success": True, 
            "booking_id": new_preorder.id,
            "message": "Transaction đặt bàn thành công!"
        }
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "message": f"Server error: {str(e)}"
        }

