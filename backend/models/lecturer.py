from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Lecturer(Base):
    """Represents a lecturer"""

    __tablename__ = 'lecturers'

    id = Column(Integer, primary_key=True, autoincrement=True)
    userId = Column(Integer, ForeignKey('users.id'), nullable=False)
    facultyId = Column(Integer, ForeignKey('faculties.id'))

    # A lecturer is a user
    user = relationship('User', back_populates='lecturer_record')
    # Faculty relationship
    faculty = relationship('Faculty', back_populates='lecturers')
