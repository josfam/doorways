"""Contains schemas for course-related classes. A course is a program that can
be taken by a student, akin to a major
"""

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base


class Course(Base):
    """Represents a course/major that a student can study"""

    __tablename__ = 'courses'

    id = Column(Integer, autoincrement=True, primary_key=True)
    course_code = Column(String(30), nullable=False)
    course_name = Column(String(120), nullable=False)

    # relationship with students
    students = relationship('Student', back_populates='course')

    def __init__(self, course_code: str, course_name: str):
        """Initialize the Course instance"""
        self.course_code = course_code
        self.course_name = course_name
