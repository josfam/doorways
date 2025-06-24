"""Contains schemas for user-related classes."""

from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy import Sequence
from sqlalchemy.orm import relationship
from .base import Base

USER_ID_START = 100000


class User(Base):
    """Represents a user of the system"""

    __tablename__ = "users"

    id = Column(String(6), primary_key=True)
    email = Column(String(120), nullable=False)
    surname = Column(String(240), nullable=False)
    given_name = Column(String(240), nullable=False)
    phone_number = Column(String(60), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    password = Column(String(240), nullable=False)

    # A user can have one role
    role = relationship("Role", back_populates="users", uselist=False)
    # A user can have many belongings, and should be deleted if the user is deleted
    belongings = relationship(
        "Belonging", back_populates="user", cascade="all, delete-orphan"
    )
    # Relationships:
    # with a student
    student_record = relationship("Student", back_populates="user")
    # with a lecturer
    lecturer_record = relationship("Lecturer", back_populates="user")
    # with a security guard
    security_guard_record = relationship("SecurityGuard", back_populates="user")
    # with a sys admin
    admin_record = relationship("SysAdmin", back_populates="user")
    # with a belonging. Belongings are deleted if the user is deleted
    belongings = relationship(
        "Belonging", back_populates="user", cascade="all, delete-orphan"
    )

    def __init__(
        self,
        id: str,
        email: str,
        surname: str,
        given_name: str,
        phone_number: str,
        role_id: int,
        password: str,
    ):
        """Initialize the User instance"""
        self.id = id
        self.email = email
        self.surname = surname
        self.given_name = given_name
        self.phone_number = phone_number
        self.role_id = role_id
        self.password = password

    def to_dict(self):
        """Convert the User instance to a dictionary"""
        return {
            "id": self.id,
            "email": self.email,
            "surname": self.surname,
            "given_name": self.given_name,
            "phone_number": self.phone_number,
            "role_id": self.role_id,
        }

    def __str__(self):
        return f"User(id='{self.id}', email='{self.email}', surname='{self.surname}', given_name='{self.given_name}', phone_number='{self.phone_number}', role_id='{self.role_id}'"
