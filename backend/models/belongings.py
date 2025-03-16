"""Contains schemas for belongings-related classes.
A belonging is an item, with more descriptive information attached to it.
"""

from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from .base import Base


class Belonging(Base):
    """Represents a generic item with extra descriptive information,
    that belongs to a specific user"""

    __tablename__ = 'belongings'

    id = Column(Integer, primary_key=True, autoincrement=True)
    userId = Column(Integer, ForeignKey('users.id'), nullable=False)
    type = Column(Integer, ForeignKey('items.id'), nullable=False)
    color = Column(String(60), nullable=False)
    brand = Column(String(60), nullable=True, default='unknown')
    notes = Column(Text, nullable=True, default='')

    # relationships:
    # with the user (the owner)
    user = relationship(
        'User', back_populates='belongings', cascade="all, delete-orphan"
    )
    # with the item
    item = relationship('Item', back_populates='belongings')
