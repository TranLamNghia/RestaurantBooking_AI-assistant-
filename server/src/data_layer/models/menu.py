import datetime
from sqlalchemy import Column, Integer, DateTime

class Menu():
    __tablename__ = "menu"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String(255), nullable=False)
    
    