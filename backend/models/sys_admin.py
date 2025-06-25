"""Contains schemas for admin-related classes."""

from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from .base import Base


class SysAdmin(Base):
    """Represents an admin of the system"""

    __tablename__ = "sysAdmins"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)

    # A user can have one sys admin role
    user = relationship("User", back_populates="sys_admin_record", uselist=False)

    def __init__(self, user_id: int):
        """Initialize the Admin instance"""
        self.user_id = user_id

    def __str__(self):
        return f"Sys Admin(id={self.id})"
