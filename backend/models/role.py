"""Contains schemas for role-related classes.
A user can be a lecturer, student, or admin.
"""

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base


class Role(Base):
    """User roles that exist in the application"""

    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, autoincrement=True)
    role_name = Column(String(160))

    # relationship. A role can be assigned to many users
    users = relationship('User', back_populates='role')

    def __init__(self, role_name: str):
        """Initialize the Role instance"""
        self.role_name = role_name
