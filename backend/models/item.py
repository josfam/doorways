from sqlalchemy import Column, Integer, String
from .base import Base


class Item(Base):
    """Represents a generic item"""

    __tablename__ = 'items'

    id = Column(Integer, autoincrement=True, primary_key=True)
    name = Column(String(120), nullable=False, unique=True)
