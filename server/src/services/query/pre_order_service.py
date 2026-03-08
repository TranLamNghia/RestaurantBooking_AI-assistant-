from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from src.data_layer.models.pre_order import PreOrder
from src.data_layer.models.menu import Menu
from src.data_layer.models.customer import Customer
from src.infrastructure.email_service import email_service
from typing import List, Optional, Dict, Any
import datetime

MAX_TABLES = 20

async def query_table_availability(
    db: Session, 
    reservation_day: Optional[datetime.date] = None, 
    reservation_time: Optional[datetime.time] = None, 
    preferred_space: Optional[str] = None
) -> Dict[str, Any]:
    
    query = db.query(PreOrder)
    
    if reservation_day:
        query = query.filter(PreOrder.reservation_day == reservation_day)
    if reservation_time:
        query = query.filter(PreOrder.reservation_time == reservation_time)
    if preferred_space:
        query = query.filter(PreOrder.preferred_space == preferred_space)

    # Check if there is a day and time, check if the number of orders exceeds MAX_TABLES
    if reservation_day and reservation_time:
        if preferred_space:
            total_booked_tables = query.count()
            is_available = total_booked_tables < MAX_TABLES
            return {
                "query_type": "exact_time",
                "is_available": is_available,
                "remaining_tables": MAX_TABLES - total_booked_tables if is_available else 0,
                "message": f"At {reservation_time.strftime('%H:%M')} on {reservation_day} for '{preferred_space}', it is {'still available' if is_available else 'fully booked'}."
            }
        else:
            # Group by preferred_space to see if any specific space is full
            booked_by_space = db.query(
                PreOrder.preferred_space, 
                func.count(PreOrder.id)
            ).filter(
                PreOrder.reservation_day == reservation_day,
                PreOrder.reservation_time == reservation_time
            ).group_by(PreOrder.preferred_space).all()
            
            full_spaces = [space for space, count in booked_by_space if count >= MAX_TABLES and space]
            message = f"At {reservation_time.strftime('%H:%M')} on {reservation_day}, general availability is open."
            if full_spaces:
                message += f" However, these spaces are FULL: {', '.join(full_spaces)}."
                
            return {
                "query_type": "exact_time",
                "is_available": True,
                "full_spaces": full_spaces,
                "message": message
            }
    
    elif reservation_time and not reservation_day:
        return {
            "query_type": "invalid_input",
            "is_available": False,
            "message": "Please provide a date to check availability."
        }
    
    elif reservation_day and not reservation_time:
        if preferred_space:
            booked_by_time = db.query(
                PreOrder.reservation_time, 
                func.count(PreOrder.id)
            ).filter(
                PreOrder.reservation_day == reservation_day,
                PreOrder.preferred_space == preferred_space
            ).group_by(PreOrder.reservation_time).all()
            
            fully_booked_times = []
            for time_val, total_tables in booked_by_time:
                if total_tables >= MAX_TABLES:
                    fully_booked_times.append(time_val.strftime("%H:%M"))
                    
            return {
                "query_type": "entire_day",
                "is_available": len(fully_booked_times) < 24, # Check if there are any time slots that are full
                "fully_booked_times": fully_booked_times,
                "message": f"On {reservation_day} for '{preferred_space}', the following slots are full: {', '.join(fully_booked_times) if fully_booked_times else 'None'}."
            }
        else:
            # Group by both time and space
            booked_by_time_space = db.query(
                PreOrder.reservation_time,
                PreOrder.preferred_space,
                func.count(PreOrder.id)
            ).filter(PreOrder.reservation_day == reservation_day).group_by(PreOrder.reservation_time, PreOrder.preferred_space).all()
            
            full_slots = []
            for time_val, space, total_tables in booked_by_time_space:
                if total_tables >= MAX_TABLES and space:
                    full_slots.append(f"{time_val.strftime('%H:%M')} ({space})")
                    
            return {
                "query_type": "entire_day",
                "is_available": True,
                "fully_booked_times": full_slots,
                "message": f"On {reservation_day}, the following specific spaces are full at these times: {', '.join(full_slots) if full_slots else 'None'}."
            }
    
    # Other general query cases (only check space, or check time in general)
    else:
        total_booked_tables = query.count()
        return {
            "query_type": "general",
            "is_available": True,
            "total_booked_tables": total_booked_tables,
            "message": f"The system records {total_booked_tables} tables booked matching the search criteria."
        }

async def query_deposit_status(db: Session, phone: str, email: str) -> bool:

    # 1. Get customer by phone or email
    customer = db.query(Customer).filter(
        or_(
            Customer.phone == phone,
            Customer.email == email
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
    
    # 3. If there is a future order, send Email and return True
    if future_preorder:
        if customer.email:
            reservation_day_str = future_preorder.reservation_day.strftime('%d/%m/%Y')
            reservation_time_str = future_preorder.reservation_time.strftime('%H:%M')
            
            has_food = "Yes" if future_preorder.preorder_items and len(future_preorder.preorder_items) > 0 else "No"
            
            pref_space = future_preorder.preferred_space if future_preorder.preferred_space else "No preference"
            
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
