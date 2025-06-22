"""Schema validation classes for user-related requests and responses"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserCreate(BaseModel):
    """Schema validation for creating a user"""

    id: str
    email: EmailStr
    surname: str
    given_name: str = Field(..., alias="given name")
    phone_number: str = Field(..., alias="phone number")
    role_name: str = Field(..., alias="role name")
    course_name: Optional[str] = Field(None, alias="course name")
    faculty_name: Optional[str] = Field(None, alias="faculty name")
    security_company: Optional[str] = Field(None, alias="security company")


class UserRead(BaseModel):
    """Schema validation for reading a user"""

    id: str
    email: EmailStr
    surname: str
    given_name: str = Field(..., alias="given name")
    phone_number: str = Field(..., alias="phone number")
    role_name: str = Field(..., alias="role name")
    course_name: Optional[str] = Field(None, alias="course name")
    faculty_name: Optional[str] = Field(None, alias="faculty name")
    security_company: Optional[str] = Field(None, alias="security company")

    class Config:
        orm_mode = True
        from_attributes = True
        allow_population_by_field_name = True


class StudentRead(UserRead):
    """Schema validation for reading a student"""

    course_name: Optional[str] = Field(None, alias="course name")


class LecturerRead(UserRead):
    """Schema validation for reading a lecturer"""

    faculty_name: Optional[str] = Field(None, alias="faculty name")


class SecurityGuardRead(UserRead):
    """Schema validation for reading a security guard"""

    security_company: Optional[str] = Field(None, alias="security company")


class LoginRequest(BaseModel):
    """Schema validation for login request"""

    email: EmailStr
    password: str
