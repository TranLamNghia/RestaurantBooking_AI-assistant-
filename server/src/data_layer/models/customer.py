import datetime
from sqlalchemy import Column, Integer, DateTime, String
from .base_models import BaseModel


class Customer(BaseModel):
    __tablename__ = "Customer"
    
    id = Column("customer_id", Integer, primary_key=True, index=True)
    name = Column("full_name", String(150), nullable=False)
    email = Column("email", String(150), nullable=True)
    phone = Column("phone", String(20), nullable=True)
    