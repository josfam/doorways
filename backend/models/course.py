from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base


class Course(Base):
    """Represents a course/major that a student can study"""

    __tablename__ = 'courses'

    id = Column(Integer, autoincrement=True, primary_key=True)
    name = Column(String(120), nullable=False)

    # relationship with students
    students = relationship('Student', back_populates='course')
