"""Contains schemas for item-related classes.
An item is a singular generically named object.
"""

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base


class Item(Base):
    """Represents a generic item"""

    __tablename__ = 'items'

    id = Column(Integer, autoincrement=True, primary_key=True)
    name = Column(String(120), nullable=False, unique=True)

    # relationships
    # with belonging
    belongings = relationship('Belonging', back_populates='item')

    def __init__(self, name: str):
        """Initialize the Item instance"""
        self.name = name
