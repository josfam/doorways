"""Schema validation classes for user-related requests and responses"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserCreate(BaseModel):
    """Schema validation for creating a user"""

    user_id: str = Field(..., alias="user id")  # predefined user id
    email: EmailStr
    surname: str
    given_name: str = Field(..., alias="given name")
    phone_number: str = Field(..., alias="phone number")
    role_name: str = Field(..., alias="role name")


class SysAdminCreate(UserCreate):
    """Schema validation for creating a system administrator"""

    pass


class AdminCreate(UserCreate):
    """Schema validation for creating an administrator"""

    pass


class StudentCreate(UserCreate):
    """Schema validation for creating a student"""

    course_name: str = Field(..., alias="course name")


class LecturerCreate(UserCreate):
    """Schema validation for creating a lecturer"""

    faculty_name: str = Field(..., alias="faculty name")


class SecurityGuardCreate(UserCreate):
    """Schema validation for creating a security guard"""

    security_company: str = Field(..., alias="security company")


class UserRead(BaseModel):
    """Schema validation for reading a user"""

    id: str
    email: EmailStr
    surname: str
    given_name: str = Field(..., alias="given name")
    phone_number: str = Field(..., alias="phone number")
    role_name: str = Field(..., alias="role name")

    class Config:
        orm_mode = True
        from_attributes = True
        allow_population_by_field_name = True


class SysAdminRead(UserRead):
    """Schema validation for reading a system administrator"""

    pass


class AdminRead(UserRead):
    """Schema validation for reading an administrator"""

    pass


class StudentRead(UserRead):
    """Schema validation for reading a student"""

    course_name: str = Field(..., alias="course name")


class LecturerRead(UserRead):
    """Schema validation for reading a lecturer"""

    faculty_name: str = Field(..., alias="faculty name")


class SecurityGuardRead(UserRead):
    """Schema validation for reading a security guard"""

    security_company: str = Field(..., alias="security company")


class LoginRequest(BaseModel):
    """Schema validation for login request"""

    email: EmailStr
    password: str
