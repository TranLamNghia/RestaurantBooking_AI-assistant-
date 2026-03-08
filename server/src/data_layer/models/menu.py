import datetime
from sqlalchemy import Column, Integer, DateTime, String, Float
from src.data_layer.database import Base

class Menu(Base):
    __tablename__ = "Menu"

    id = Column("id", String(50), primary_key=True, index=True)
    name = Column("name", String(255), nullable=False)
    description = Column("description", String(255), nullable=True)
    price = Column("price", Float, nullable=False)
    category = Column("category", String(100), nullable=False)
    type = Column("type", String(50), nullable=False)
    created_at = Column("created_at", DateTime, default=datetime.datetime.now)