"""API routes for admin-related actions"""

import sys
from pydantic_core import ValidationError
from sqlalchemy import or_
from sqlalchemy.orm import Session
from typing import List, Union, Optional
from fastapi import APIRouter, status, Depends, Body, Response
from fastapi.responses import JSONResponse
from backend.storage.database import get_db
from backend.api.v1.utils.auth_utils import hash_password, create_default_password
from backend.models.user import User
from backend.models.student import Student
from backend.models.lecturer import Lecturer
from backend.models.security_guard import SecurityGuard

from backend.schema_validation.user_validation import (
    UserCreate,
    StudentCreate,
    LecturerCreate,
    SecurityGuardCreate,
    SysAdminCreate,
    AdminCreate,
    UserRead,
    StudentRead,
    LecturerRead,
)
from backend.api.v1.utils.role_utils import (
    add_user_to_role_table,
    get_role_id_from_name,
    get_course_name_from_id,
)
from backend.api.v1.utils.constants import role_names

sys_admin_router = APIRouter(prefix="/sys-admin", tags=["admin"])


def create_user_in_db(
    user_data: UserCreate, db: Session, role_name: Optional[str] = None
) -> dict:
    """Helper function to create a user in the database"""
    role_name = role_name or user_data.role_name

    # Check that the role exists
    if role_name not in role_names:
        return {
            "success": False,
            "message": f"Role '{role_name}' is not recognized.",
            "status_code": status.HTTP_400_BAD_REQUEST,
        }

    # Check for a duplicate email or id
    if user_data.email:
        existing_user = (
            db.query(User)
            .filter(or_(User.email == user_data.email, User.id == user_data.user_id))
            .first()
        )
    else:
        existing_user = db.query(User).filter(User.id == user_data.user_id).first()

    if existing_user:
        return {
            "success": False,
            "message": f"User already exists",
            "status_code": status.HTTP_409_CONFLICT,
        }

    # Create a default password for the user
    default_password = create_default_password(user_data, user_data.email)
    role_info = get_role_id_from_name(role_name)
    if not role_info["success"]:
        return {
            "success": False,
            "message": role_info["message"],
            "status_code": status.HTTP_400_BAD_REQUEST,
        }

    role_id = role_info["role_id"]

    # create a user and add them to the appropriate tables
    new_user = User(
        id=user_data.user_id,
        email=str(user_data.email),
        surname=user_data.surname,
        given_name=user_data.given_name,
        phone_number=user_data.phone_number,
        role_id=int(role_id),
        password=default_password,
    )

    try:
        db.add(new_user)
        result = add_user_to_role_table(
            role_name=role_name,
            user_data=user_data,
            user=new_user,
            session=db,
        )
        # the caller handles the committing / rollback
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "message": str(e),
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        }
    return {
        "success": True,
        "message": "User added successfully",
        "status_code": status.HTTP_201_CREATED,
    }


@sys_admin_router.post("/user", status_code=status.HTTP_201_CREATED)
def add_user(user_data: dict = Body(...), db: Session = Depends(get_db)):
    """Adds one user to the database"""
    # check for a duplicate email or id

    role_name = user_data["role name"]
    if role_name not in role_names:
        return JSONResponse(
            content={"message": f"Role '{role_name}' is not recognized."},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    # Validate with the appropriate model
    if role_name == "student":
        validated_data = StudentCreate.model_validate(user_data)
    elif role_name == "lecturer":
        validated_data = LecturerCreate.model_validate(user_data)
    elif role_name == "security guard":
        validated_data = SecurityGuardCreate.model_validate(user_data)
    else:
        validated_data = UserCreate.model_validate(user_data)

    result = create_user_in_db(validated_data, db, role_name=user_data["role name"])
    if not result["success"]:
        return JSONResponse(
            content={"message": result["message"]},
            status_code=result["status_code"],
        )
    # commit the transactions
    db.commit()

    return JSONResponse(
        content={"message": result["message"]},
        status_code=result["status_code"],
    )


@sys_admin_router.post("/upload/students", status_code=status.HTTP_200_OK)
def upload_students(db: Session = Depends(get_db), students_data=Body(...)):
    """Adds multiple students to the database"""
    # track processed and unprocessed data
    processed_students = []
    unprocessed_students = []

    for student_data in students_data:
        # turn the "student id" key as the "user id" key for validation's sake
        if "student id" in student_data and "user id" not in student_data:
            student_data["user id"] = student_data.pop("student id")
        try:
            user_obj = StudentCreate.model_validate(student_data)
            result = create_user_in_db(
                user_data=user_obj,
                db=db,
                role_name="student",
            )

            if result["success"]:
                processed_students.append(
                    {
                        "user id": user_obj.user_id,
                        "email": user_obj.email,
                        "surname": user_obj.surname,
                        "course name": user_obj.course_name,
                    }
                )
            else:
                unprocessed_students.append(
                    {
                        "user id": user_obj.user_id,
                        "email": user_obj.email,
                        "surname": user_obj.surname,
                        "error": result["message"],
                    }
                )

        except ValidationError as e:
            return JSONResponse(
                content={"message": str(e)},
                status_code=status.HTTP_400_BAD_REQUEST,
            )
    # commit the transactions
    if len(processed_students):
        db.commit()

    return JSONResponse(
        content={
            "message": f"Processed {len(processed_students)} students successfully.",
            "processed students": processed_students,
            "failed": unprocessed_students,
        },
        status_code=status.HTTP_200_OK,
    )


@sys_admin_router.post("/upload/lecturers", status_code=status.HTTP_200_OK)
def upload_lecturers(db: Session = Depends(get_db), lecturers_data=Body(...)):
    """Adds multiple lecturers to the database"""
    # track processed and unprocessed data
    processed_lecturers = []
    unprocessed_lecturers = []

    for lecturer_data in lecturers_data:
        # turn the "student id" key as the "user id" key for validation's sake
        if "lecturer id" in lecturer_data and "user id" not in lecturer_data:
            lecturer_data["user id"] = lecturer_data.pop("lecturer id")
        try:
            user_obj = LecturerCreate.model_validate(lecturer_data)
            result = create_user_in_db(
                user_data=user_obj,
                db=db,
                role_name="lecturer",
            )

            if result["success"]:
                processed_lecturers.append(
                    {
                        "user id": user_obj.user_id,
                        "email": user_obj.email,
                        "surname": user_obj.surname,
                        "course name": user_obj.faculty_name,
                    }
                )
            else:
                unprocessed_lecturers.append(
                    {
                        "user id": user_obj.user_id,
                        "email": user_obj.email,
                        "surname": user_obj.surname,
                        "error": result["message"],
                    }
                )

        except ValidationError as e:
            return JSONResponse(
                content={"message": str(e)},
                status_code=status.HTTP_400_BAD_REQUEST,
            )
    # commit the transactions
    if len(processed_lecturers):
        db.commit()

    return JSONResponse(
        content={
            "message": f"Processed {len(processed_lecturers)} lecturers successfully.",
            "processed lecturers": processed_lecturers,
            "failed": unprocessed_lecturers,
        },
        status_code=status.HTTP_200_OK,
    )


@sys_admin_router.post("/upload/security-guards", status_code=status.HTTP_200_OK)
def upload_security_guards(db: Session = Depends(get_db), guards_data=Body(...)):
    """Adds multiple security guards data to the database"""
    # track processed and unprocessed data
    processed_guards = []
    unprocessed_guards = []

    for guard_data in guards_data:
        # turn the "student id" key as the "user id" key for validation's sake
        if "security id" in guard_data and "user id" not in guard_data:
            guard_data["user id"] = guard_data.pop("security id")
        try:
            user_obj = SecurityGuardCreate.model_validate(guard_data)
            result = create_user_in_db(
                user_data=user_obj,
                db=db,
                role_name="security guard",
            )

            if result["success"]:
                processed_guards.append(
                    {
                        "user id": user_obj.user_id,
                        "email": user_obj.email,
                        "surname": user_obj.surname,
                        "security company": user_obj.security_company,
                    }
                )
            else:
                unprocessed_guards.append(
                    {
                        "user id": user_obj.user_id,
                        "email": user_obj.email,
                        "surname": user_obj.surname,
                        "error": result["message"],
                    }
                )

        except ValidationError as e:
            return JSONResponse(
                content={"message": str(e)},
                status_code=status.HTTP_400_BAD_REQUEST,
            )
    # commit the transactions
    if len(processed_guards):
        db.commit()

    return JSONResponse(
        content={
            "message": f"Processed {len(processed_guards)} guards successfully.",
            "processed lecturers": processed_guards,
            "failed": unprocessed_guards,
        },
        status_code=status.HTTP_200_OK,
    )


@sys_admin_router.post("/upload/sys-admins", status_code=status.HTTP_200_OK)
def upload_sys_admins(db: Session = Depends(get_db), sys_admins_data=Body(...)):
    """Adds multiple sys admins to the database"""
    # track processed and unprocessed data
    processed_sys_admins = []
    unprocessed_sys_admins = []

    for sys_admin_data in sys_admins_data:
        # turn the "student id" key as the "user id" key for validation's sake
        if "sys admin id" in sys_admin_data and "user id" not in sys_admin_data:
            sys_admin_data["user id"] = sys_admin_data.pop("sys admin id")
        try:
            user_obj = SysAdminCreate.model_validate(sys_admin_data)
            result = create_user_in_db(
                user_data=user_obj,
                db=db,
                role_name="sys admin",
            )

            if result["success"]:
                processed_sys_admins.append(
                    {
                        "user id": user_obj.user_id,
                        "email": user_obj.email,
                        "surname": user_obj.surname,
                    }
                )
            else:
                unprocessed_sys_admins.append(
                    {
                        "user id": user_obj.user_id,
                        "email": user_obj.email,
                        "surname": user_obj.surname,
                        "error": result["message"],
                    }
                )

        except ValidationError as e:
            return JSONResponse(
                content={"message": str(e)},
                status_code=status.HTTP_400_BAD_REQUEST,
            )
    # commit the transactions
    if len(processed_sys_admins):
        db.commit()

    return JSONResponse(
        content={
            "message": f"Processed {len(processed_sys_admins)} sys admins successfully.",
            "processed lecturers": processed_sys_admins,
            "failed": unprocessed_sys_admins,
        },
        status_code=status.HTTP_200_OK,
    )


@sys_admin_router.post("/upload/admins", status_code=status.HTTP_200_OK)
def upload_admins(db: Session = Depends(get_db), admins_data=Body(...)):
    """Adds multiple admins to the database"""
    # track processed and unprocessed data
    processed_admins = []
    unprocessed_admins = []

    for admin_data in admins_data:
        # turn the "student id" key as the "user id" key for validation's sake
        if "admin id" in admin_data and "user id" not in admin_data:
            admin_data["user id"] = admin_data.pop("admin id")
        try:
            user_obj = AdminCreate.model_validate(admin_data)
            result = create_user_in_db(
                user_data=user_obj,
                db=db,
                role_name="admin",
            )

            if result["success"]:
                processed_admins.append(
                    {
                        "user id": user_obj.user_id,
                        "email": user_obj.email,
                        "surname": user_obj.surname,
                    }
                )
            else:
                unprocessed_admins.append(
                    {
                        "user id": user_obj.user_id,
                        "email": user_obj.email,
                        "surname": user_obj.surname,
                        "error": result["message"],
                    }
                )

        except ValidationError as e:
            return JSONResponse(
                content={"message": str(e)},
                status_code=status.HTTP_400_BAD_REQUEST,
            )
    # commit the transactions
    if len(processed_admins):
        db.commit()

    return JSONResponse(
        content={
            "message": f"Processed {len(processed_admins)} admins successfully.",
            "processed": processed_admins,
            "failed": unprocessed_admins,
        },
        status_code=status.HTTP_200_OK,
    )


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
    all_students = db.query(Student).all()
    formatted_students = []

    for student in all_students:
        # Get the course name
        course_name: str = (
            student.course.course_name if student.course else "unknown course"
        )

        # Format the student data
        formatted_students.append(
            {
                **student.user.to_dict(),
                "course_id": student.course_id,
                "course name": course_name,
                "role name": "student",
            }
        )

    if not all_students:
        return JSONResponse(
            content={"message": "No students found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )
    return formatted_students


@sys_admin_router.get(
    "/users/lecturers",
    status_code=status.HTTP_200_OK,
    response_model=List[LecturerRead],
)
def get_lecturers(db: Session = Depends(get_db)):
    """Returns all lecturers in the database"""
    all_lecturers = db.query(Lecturer).all()
    formatted_lecturers = []

    for lecturer in all_lecturers:
        # Get the faculty name
        faculty_name = lecturer.faculty.name if lecturer.faculty else "unknown faculty"
        lecturer.user.faculty_name = faculty_name

        # Format the student data
        formatted_lecturers.append(
            {
                **lecturer.user.to_dict(),
                "faculty_id": lecturer.faculty_id,
                "faculty name": faculty_name,
                "role name": "lecturer",
            }
        )

    if not all_lecturers:
        return JSONResponse(
            content={"message": "No students found"},
            status_code=status.HTTP_404_NOT_FOUND,
        )
    return formatted_lecturers


@sys_admin_router.get(
    "/users/security-guards",
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
def update_user(
    user_id: str,
    user_data: Union[
        UserCreate,
        StudentCreate,
        SysAdminCreate,
        AdminCreate,
        SecurityGuardCreate,
        LecturerCreate,
    ] = Body(...),
    db: Session = Depends(get_db),
):
    """Updates a user's details"""
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"message": "User not found"}, status.HTTP_404_NOT_FOUND
    # Change only updatable information
    user.surname = user_data.surname
    user.given_name = user_data.given_name
    user.phone_number = user_data.phone_number
    print(user)
    db.commit()
    db.refresh(user)
    return JSONResponse(
        content={"message": "Updated successfully"}, status_code=status.HTTP_200_OK
    )


@sys_admin_router.delete("/user/{user_id}", status_code=status.HTTP_200_OK)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Deletes a user from the database"""
    pass
