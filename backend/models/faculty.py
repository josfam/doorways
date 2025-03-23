"""Contains schemas for faculty-related classes."""

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base


class Faculty(Base):
    """Represents a faculty in the university that a lecturer can belong to"""

    __tablename__ = 'faculties'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(240))

    #  relationship with lecturers
    lecturers = relationship('Lecturer', back_populates='faculty')

    def __init__(self, name: str):
        """Initialize the Faculty instance"""
        self.name = name
