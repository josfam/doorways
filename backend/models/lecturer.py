"""Contains schemas for lecturer-related classes."""

from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Lecturer(Base):
    """Represents a lecturer"""

    __tablename__ = "lecturers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    faculty_id = Column(Integer, ForeignKey("faculties.id"))

    # A lecturer is a user
    user = relationship("User", back_populates="lecturer_record", uselist=False)
    # Faculty relationship
    faculty = relationship("Faculty", back_populates="lecturers")

    def __init__(self, user_id: int, faculty_id: int):
        """Initialize the Lecturer instance"""
        self.user_id = user_id
        self.faculty_id = faculty_id

    def to_dict(self):
        """Convert the Lecturer instance to a dictionary"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "faculty_id": self.faculty_id,
        }
