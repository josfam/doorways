"""API routes for admin-related actions"""

import sys
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import List
from fastapi import APIRouter, status, Depends, Body, Response
from backend.storage.database import get_db
from backend.api.v1.utils.auth_utils import hash_password
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
from backend.api.v1.utils.role_utils import (
    add_user_to_role_table,
    get_role_id_from_name,
)
from backend.api.v1.utils.custom_exceptions import MissingUserAttributeError
from backend.api.v1.utils.constants import role_names

sys_admin_router = APIRouter(prefix="/sys-admin", tags=["admin"])


@sys_admin_router.post("/user", status_code=status.HTTP_201_CREATED)
def add_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Adds one user to the database"""
    # check for a duplicate email or id
    if user_data.email:
        existing_user = (
            db.query(User)
            .filter(or_(User.email == user_data.email, User.id == user_data.id))
            .first()
        )
    else:
        existing_user = db.query(User).filter(User.id == user_data.id).first()

    if existing_user:
        return Response(
            content={"message": "User already exists"},
            status_code=status.HTTP_409_CONFLICT,
        )

    # create a default password for this user if none has been provided
    password = ""
    if user_data.email:
        password = (user_data.email.split("@")[0] + user_data.given_name).lower()
    else:
        # security guards do not have an email
        password = user_data.given_name.lower() + user_data.surname.lower()
    hashed_pwd = hash_password(password)

    role_name = user_data.role_name
    if role_name not in role_names:
        return Response(
            content={"message": "Invalid role name"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    role_info = get_role_id_from_name(user_data.role_name)
    if not role_info["success"]:
        return Response(
            content={"message": role_info["message"]},
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    role_id = role_info["role_id"]

    new_user = User(
        id=user_data.id,
        email=user_data.email,
        surname=user_data.surname,
        given_name=user_data.given_name,
        phone_number=user_data.phone_number,
        role_id=int(role_id),
        password=hashed_pwd,
    )

    try:
        db.add(new_user)
        add_user_to_role_table(
            role_name=user_data.role_name,
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


@sys_admin_router.post("/users", status_code=status.HTTP_200_OK)
def add_users(db: Session = Depends(get_db)):
    """Adds multiple users to the database"""
    pass


@sys_admin_router.get(
    "/users", status_code=status.HTTP_200_OK, response_model=List[UserRead]
)
def get_users(db: Session = Depends(get_db)):
    """Returns all users in the database"""
    users = db.query(User).all()
    if not users:
        return {"message": "No users found"}, status.HTTP_404_NOT_FOUND
    return [UserRead.model_validate(user) for user in users]


@sys_admin_router.get(
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


@sys_admin_router.get(
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


@sys_admin_router.get(
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


@sys_admin_router.patch("/user/{user_id}", status_code=status.HTTP_200_OK)
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


@sys_admin_router.delete("/user/{user_id}", status_code=status.HTTP_200_OK)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Deletes a user from the database"""
    pass
