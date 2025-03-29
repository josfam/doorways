"""Contains schemas for security-guard-related classes."""

from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class SecurityGuard(Base):
    """Represents a security guard, i.e. the person at the entrance of the
    premises that checks the students belongings on entry and exit
    """

    __tablename__ = 'securityGuards'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    # a security guard is a user
    user = relationship(
        'User', back_populates='security_guard_record', uselist=False
    )

    def __init__(self, user_id: int):
        """Initialize the SecurityGuard instance"""
        self.user_id = user_id
