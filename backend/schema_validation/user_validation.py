"""Schema validation classes for user-related requests and responses"""

from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    """Schema validation for creating a user"""

    email: EmailStr
    surname: str
    given_name: str
    phone_number: str
    role_id: int
    password: str
    course_id: Optional[int] = None
    faculty_id: Optional[int] = None


class UserRead(BaseModel):
    """Schema validation for reading a user"""

    id: int
    email: EmailStr
    surname: str
    given_name: str
    phone_number: str
    role_id: int
    course_id: Optional[int] = None
    faculty_id: Optional[int] = None

    class Config:
        orm_mode = True
        from_attributes = True


class StudentRead(UserRead):
    """Schema validation for reading a student"""

    course_id: int


class LecturerRead(UserRead):
    """Schema validation for reading a lecturer"""

    faculty_id: int
