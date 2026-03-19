import json
import datetime
from typing import Optional, List
from langchain.tools import tool
from pydantic import Field
from sqlalchemy.orm import Session

from src.services.query.menu_service import get_all_menu_items
from src.services.query.pre_order_service import query_table_availability, query_deposit_status

class ToolRegistry:
    """
    Register and map functions (Function Mapping).
    Provide a list of Tools to pass into LangChain Agent.
    """
    
    @staticmethod
    def get_tools(db: Session) -> List:
        """
        Initialize and return a list of Tools (already wrapped with DB query logic).
        """
        
        @tool
        async def check_menu(category: Optional[str] = None, item_type: Optional[str] = None) -> str:
            """
            Fetch the restaurant's menu information.
            Use this when the guest asks about food, drinks, or prices.
            Can filter by `category` (e.g., 'Starters', 'Centrepiece', 'Sidepiece', 'Cocktails — Classics') or `item_type` ('food', 'beverage').
            """
            print(f"[AI TOOL CALLED] 'check_menu' -> Category: {category} | Type: {item_type}\\n{'='*40}\\n")
            
            try:
                items = await get_all_menu_items(db, category=category, item_type=item_type)
                if not items:
                    return "No menu items found for this category."
                
                result = [f"- {item.name}: ${item.price} (Category: {item.category})" for item in items]
                return "\\n".join(result)
            except Exception as e:
                return f"Error fetching menu: {str(e)}"

        @tool
        async def check_availability(
            date: Optional[str] = Field(None, description="Reservation date in YYYY-MM-DD format."),
            time: Optional[str] = Field(None, description="Reservation time in HH:MM format."),
            preferred_space: Optional[str] = Field(None, description="Preferred space: 'Outdoor Veranda', 'The Grand Hall', 'Group Dining', 'Sofa Booth', 'Private VIP Room', 'Event Space'")
        ) -> str:
            """
            Check the restaurant's table availability. ALWAYS ask the guest for the DATE before calling this function.
            """
            print(f"[AI TOOL CALLED] 'check_availability' -> Date: {date} | Time: {time} | Space: {preferred_space}\\n{'='*40}\\n")
            
            res_day, res_time = None, None
            try:
                if date:
                    res_day = datetime.datetime.strptime(date, "%Y-%m-%d").date()
                if time:
                    res_time = datetime.datetime.strptime(time, "%H:%M").time()
            except ValueError:
                return "Invalid date or time format. Please use YYYY-MM-DD and HH:MM."

            try:
                result = await query_table_availability(db, reservation_day=res_day, reservation_time=res_time, preferred_space=preferred_space)
                return json.dumps(result, ensure_ascii=False)
            except Exception as e:
                return f"System error checking availability: {str(e)}"

        @tool
        async def check_deposit(phone: str, email: Optional[str] = None) -> str:
            """
            Check the customer's deposit payment status.
            """
            print(f"[AI TOOL CALLED] 'check_deposit' -> Phone: {phone} | Email: {email}\\n{'='*40}\\n")
            
            try:
                has_deposited = await query_deposit_status(db, phone=phone, email=email or "")
                if has_deposited:
                    return f"Customer {phone} HAS successfully paid the deposit."
                else:
                    return f"NO deposit payment recorded for phone {phone}."
            except Exception as e:
                return f"System error checking deposit: {str(e)}"

        return [check_menu, check_availability, check_deposit]
