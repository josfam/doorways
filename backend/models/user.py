from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class User(Base):
    """Represents a user of the system"""

    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(120), nullable=False)
    surname = Column(String(240), nullable=False)
    givenName = Column(String(240), nullable=False)
    phoneNumber = Column(String(60))
    roleId = Column(Integer, ForeignKey('roles.id'))

    # A user can have one role
    role = relationship('Role', back_populates='users', uselist=False)
    # A user can have many belongings, and should be deleted if the user is deleted
    belongings = relationship(
        'Belonging', back_populates='user', cascade="all, delete-orphan"
    )
    # Relationships:
    # with a student
    student_record = relationship('Student', back_populates='user')
    # with a lecturer
    lecturer_record = relationship('Lecturer', back_populates='user')
    # with a belonging
    belongings = relationship('Belonging', back_populates='user')
