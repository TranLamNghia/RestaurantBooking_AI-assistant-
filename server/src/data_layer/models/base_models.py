import datetime
from sqlalchemy import Column, Integer, DateTime

class BaseModel(Base):
    __abstract__ = True
    id: int = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.now)