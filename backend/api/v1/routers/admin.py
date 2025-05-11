"""API routes for admin-related actions"""

import sys
from sqlalchemy.orm import Session
from typing import List
from fastapi import APIRouter, status, Depends
from backend.storage.database import get_db
from backend.api.v1.auth.passwords import hash_password
from backend.models.user import User
from backend.models.student import Student
from backend.models.lecturer import Lecturer
from backend.models.security_guard import SecurityGuard

from backend.schema_validation.user_validation import (
    UserCreate,
    UserRead,
    StudentRead,
    LecturerRead,
)
from backend.api.v1.utils.role_utils import add_user_to_role_table
from backend.api.v1.utils.custom_exceptions import MissingUserAttributeError

admin_router = APIRouter(prefix="/admin", tags=["admin"])


@admin_router.post("/user", status_code=status.HTTP_201_CREATED)
def add_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Adds one user to the database"""
    # create a default password for this user if none has been provided
    if not len(user_data.password):
        password = (user_data.email.split("@")[0] + user_data.given_name).lower()
        hashed_pwd = hash_password(password)
    else:
        hashed_pwd = hash_password(user_data.password)
    existing_email = db.query(User.email).filter(User.email == user_data.email).first()
    if existing_email:
        return {"message": "User already exists"}, status.HTTP_409_CONFLICT

    new_user = User(
        user_data.email,
        user_data.surname,
        user_data.given_name,
        user_data.phone_number,
        user_data.role_id,
        password=hashed_pwd,
    )

    try:
        db.add(new_user)
        add_user_to_role_table(
            role_id=user_data.role_id,
            user_data=user_data,
            user=new_user,
            session=db,
        )
        db.commit()
    except MissingUserAttributeError as e:
        db.rollback()
        return {"message": str(e)}, status.HTTP_400_BAD_REQUEST
    except Exception as e:
        db.rollback()
        return {"message": str(e)}, status.HTTP_500_INTERNAL_SERVER_ERROR

    return {"message": "User added successfully"}, status.HTTP_201_CREATED


@admin_router.post("/users", status_code=status.HTTP_200_OK)
def add_users(db: Session = Depends(get_db)):
    """Adds multiple users to the database"""
    pass


@admin_router.get(
    "/users", status_code=status.HTTP_200_OK, response_model=List[UserRead]
)
def get_users(db: Session = Depends(get_db)):
    """Returns all users in the database"""
    users = db.query(User).all()
    if not users:
        return {"message": "No users found"}, status.HTTP_404_NOT_FOUND
    return [UserRead.model_validate(user) for user in users]


@admin_router.get(
    "/users/students",
    status_code=status.HTTP_200_OK,
    response_model=List[StudentRead],
)
def get_students(db: Session = Depends(get_db)):
    """Returns all students in the database"""
    students = db.query(Student).all()
    users = [
        {**student.user.to_dict(), "course_id": student.course_id}
        for student in students
    ]
    if not students:
        return {"message": "No students found"}, status.HTTP_404_NOT_FOUND
    return users


@admin_router.get(
    "/users/lecturers",
    status_code=status.HTTP_200_OK,
    response_model=List[LecturerRead],
)
def get_lecturers(db: Session = Depends(get_db)):
    """Returns all lecturers in the database"""
    lecturers = db.query(Lecturer).all()
    users = [
        {**lecturer.user.to_dict(), "faculty_id": lecturer.faculty_id}
        for lecturer in lecturers
    ]

    if not lecturers:
        return {"message": "No lecturers found"}, status.HTTP_404_NOT_FOUND
    return users


@admin_router.get(
    "/users/security_guards",
    status_code=status.HTTP_200_OK,
    response_model=List[UserRead],
)
def get_security_guards(db: Session = Depends(get_db)):
    """Returns all security guards in the database"""
    security_guards = db.query(SecurityGuard).all()
    users = [security_guard.user.to_dict() for security_guard in security_guards]

    if not security_guards:
        return {"message": "No security guards found"}, status.HTTP_404_NOT_FOUND

    return users


@admin_router.patch("/user/{user_id}", status_code=status.HTTP_200_OK)
def update_user(user_id: int, user_data: UserCreate, db: Session = Depends(get_db)):
    """Updates a user's details"""
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"message": "User not found"}, status.HTTP_404_NOT_FOUND
    # Update user details
    user.email = user_data.email
    user.surname = user_data.surname
    user.given_name = user_data.given_name
    user.phone_number = user_data.phone_number
    user.role_id = user_data.role_id
    user.password = hash_password(user_data.password)
    # Commit changes to the database
    db.commit()
    db.refresh(user)
    return {"message": "User updated successfully"}, status.HTTP_200_OK


@admin_router.delete("/user/{user_id}", status_code=status.HTTP_200_OK)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Deletes a user from the database"""
    pass
