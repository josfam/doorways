"""Contains schemas for student-related classes."""

from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Student(Base):
    """Represents a student"""

    __tablename__ = 'students'

    id = Column(Integer, primary_key=True, autoincrement=True)
    userId = Column(Integer, ForeignKey('users.id'), nullable=False)
    courseId = Column(Integer, ForeignKey('courses.id'))

    # a student is a user
    user = relationship('User', back_populates='student_record', uselist=False)
    # relationship with course
    course = relationship('Course', back_populates='students')

    def __init__(self, user_id: int, course_id: int):
        """Initialize the Student instance"""
        self.userId = user_id
        self.courseId = course_id
