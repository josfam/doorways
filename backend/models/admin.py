"""Contains schemas for admin-related classes."""

from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Admin(Base):
    """Represents an admin of the system"""

    __tablename__ = 'admins'

    id = Column(Integer, primary_key=True, autoincrement=True)
    userId = Column(Integer, ForeignKey('users.id'), nullable=False)

    # A user can have one admin role
    user = relationship('User', back_populates='admin_record', uselist=False)
