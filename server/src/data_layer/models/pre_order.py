import datetime
from sqlalchemy import Column, Integer, DateTime, Date, Time, String, ForeignKey, JSON
from .base_models import BaseModel

class PreOrder(BaseModel):
    __tablename__ = "PreOrder"
    
    id = Column("preorder_id", Integer, primary_key=True, index=True)
    
    customer_id = Column("customer_id", Integer, ForeignKey("Customer.customer_id", ondelete="CASCADE"), nullable=False)
    payment_status = Column("payment_status", String(10), nullable=True)

    reservation_day = Column("reservation_date", Date, nullable=False)
    reservation_time = Column("reservation_time", Time, nullable=False)
    guests = Column("guests", Integer, nullable=False)

    preferred_space = Column("preferred_space", String(50), nullable=True)
    occasion = Column("occasion", String(100), nullable=True)
    special_notes = Column("special_notes", String(255), nullable=True)

    preorder_items = Column("preorder_items", JSON, nullable=True)