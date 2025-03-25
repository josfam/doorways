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
