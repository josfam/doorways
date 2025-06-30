"""Contains schemas for security-guard-related classes."""

from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from .base import Base


class SecurityGuard(Base):
    """Represents a security guard, i.e. the person at the entrance of the
    premises that checks the students belongings on entry and exit
    """

    __tablename__ = "securityGuards"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    security_company = Column(String, nullable=False, default="Unknown")

    # a security guard is a user
    user = relationship("User", back_populates="security_guard_record", uselist=False)

    def __init__(self, user_id: int, security_company: str = "Unknown"):
        """Initialize the SecurityGuard instance"""
        self.user_id = user_id
        self.security_company = security_company

    def to_dict(self):
        """Convert the SecurityGuard instance to a dictionary"""
        return {
            "id": self.id,
            "user_id": self.user_id,
        }
