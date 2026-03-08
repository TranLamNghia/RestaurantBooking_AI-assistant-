import datetime
from sqlalchemy import Column, Integer, DateTime, Date, Time, String, ForeignKey, JSON
from .base_models import BaseModel

class PreOrder(BaseModel):
    __tablename__ = "pre_order"
    
    customer_id = Column(Integer, ForeignKey("customer.id", ondelete="CASCADE"), nullable=False)
    payment_status = Column(String(10), nullable=False, default="PENDING")

    reservation_day = Column(Date, nullable=False)
    reservation_time = Column(Time, nullable=False)
    guests = Column(Integer, nullable=False)

    preferred_space = Column(String(255), nullable=False)
    occasion = Column(String(255), nullable=True)
    special_notes = Column(String(255), nullable=True)

    preorder_items = Column(JSON, nullable=True)
    