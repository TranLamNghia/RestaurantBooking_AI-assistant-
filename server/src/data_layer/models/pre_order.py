import datetime
from sqlalchemy import Column, Integer, DateTime, Date, Time, String, ForeignKey, JSON
from .base_models import BaseModel

class PreOrder(BaseModel):
    __tablename__ = "pre_order"
    customer_id = Column(Integer, ForeignKey("Customer.customer_id", ondelete="CASCADE"), nullable=False)

    reservation_day = Column(Date, nullable=False)
    reservation_time = Column(Time, nullable=False)
    guests = Column(Integer, nullable=False)

    preferred_space = Column(String(255), nullable=False)
    occasion = Column(String(255), nullable=True)
    special_notes = Column(String(255), nullable=True)
    
    preorder_items = Column(JSON, nullable=True)
    