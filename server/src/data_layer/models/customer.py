import datetime
from sqlalchemy import Column, Integer, DateTime
from .base_models import BaseModel


class Customer(BaseModel):
    __tablename__ = "customer"
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(255), nullable=False)
    