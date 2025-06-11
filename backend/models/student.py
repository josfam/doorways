"""Contains schemas for student-related classes."""

from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from .base import Base


class Student(Base):
    """Represents a student"""

    __tablename__ = "students"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"))

    # a student is a user
    user = relationship("User", back_populates="student_record", uselist=False)
    # relationship with course
    course = relationship("Course", back_populates="students")

    def __init__(self, user_id: int, course_id: int):
        """Initialize the Student instance"""
        self.user_id = user_id
        self.course_id = course_id
