import datetime
from sqlalchemy import Column, Integer, DateTime
from src.data_layer.database import Base

class BaseModel(Base):
    __abstract__ = True
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.now)