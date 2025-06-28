"""For role-related functions"""

from sqlalchemy.orm import Session
from typing import Optional, Union
from backend.schema_validation.user_validation import (
    UserCreate,
    StudentCreate,
    LecturerCreate,
    SecurityGuardCreate,
)
from backend.models.user import User
from backend.models.student import Student
from backend.models.lecturer import Lecturer
from backend.models.security_guard import SecurityGuard
from backend.models.sys_admin import SysAdmin
from backend.models.admin import Admin
from backend.models.course import Course
from backend.models.faculty import Faculty
from backend.models.role import Role
from backend.api.v1.utils.constants import role_names


def add_user_to_role_table(
    role_name: str,
    user_data: Union[UserCreate, StudentCreate, LecturerCreate, SecurityGuardCreate],
    user: User,
    session: Session,
) -> dict[str, bool | str]:
    """Adds a user to their respective role table, based on the role id"""

    if role_name not in role_names:
        return {"success": False, "message": "Role name is required"}

    if role_name == "student":
        # Check if user_data is a StudentCreate instance
        if not isinstance(user_data, StudentCreate) and not hasattr(
            user_data, "course_name"
        ):
            return {
                "success": False,
                "message": "Student data required for student role",
            }

        course_info = get_course_id_from_name(user_data.course_name, session)

        if not course_info["success"]:
            return {"success": False, "message": course_info["message"]}
        course_id = int(course_info["course_id"])
        student = Student(user_id=str(user.id), course_id=course_id)
        session.add(student)
        return {"success": True, "message": "Student added successfully"}
    elif role_name == "lecturer":
        faculty_name = user_data.faculty_name
        # get the faculty ID
        faculty_info = session.query(Faculty.id).filter_by(name=faculty_name).first()
        if not faculty_info:
            return {"success": False, "message": f"Faculty '{faculty_name}' not found"}
        faculty_id = faculty_info[0]
        lecturer = Lecturer(user_id=user.id, faculty_id=faculty_id)
        print(
            f"Adding lecturer with user ID: {user.id} and faculty ID: {faculty_id}"
        )  # DEBUG
        session.add(lecturer)
        return {"success": True, "message": "Lecturer added successfully"}
    elif role_name == "sys admin":
        sys_admin = SysAdmin(user_id=user.id)
        session.add(sys_admin)
        return {"success": True, "message": "Admin added successfully"}
    elif role_name == "security guard":
        security_guard = SecurityGuard(
            user_id=user.id, security_company=user_data.security_company
        )
        session.add(security_guard)
        return {"success": True, "message": "Security guard added successfully"}
    elif role_name == "admin":
        # Admin role is not explicitly defined in the models, but can be handled similarly
        admin = Admin(user_id=user.id)
        session.add(admin)
        return {"success": True, "message": "Admin added successfully"}
    else:
        print(f"Role name '{role_name}' is not recognized")
        return {"success": False, "message": "Nothing was added to the role table"}


def get_role_name_from_id(role_id: int) -> dict[str, bool | str]:
    """Returns the role name based on the role ID"""
    role_ids = {v: k for k, v in role_names.items()}
    role_name = role_ids.get(role_id, "Unknown")
    if role_name not in get_available_roles():
        return {"success": False, "message": "Role ID not recognized"}
    return {"success": True, "role_name": role_name}


def get_role_id_from_name(role_name: str) -> dict[str, bool | int | str]:
    """Returns the role ID based on the role name"""
    if role_name not in role_names:
        return {"success": False, "message": "Role name not recognized"}
    return {"success": True, "role_id": role_names[role_name]}


def get_course_id_from_name(
    course_name: str, session: Session
) -> dict[str, bool | int | str]:
    """Returns the course ID based on the course name"""
    course_info = session.query(Course.id).filter_by(course_name=course_name).first()
    if not course_info:
        return {"success": False, "message": f"Course '{course_name}' not found"}
    return {"success": True, "course_id": course_info[0]}


def get_course_name_from_id(course_id: int, session: Session) -> dict[str, bool | str]:
    """Returns the course name based on the course ID"""
    course_info = session.query(Course.course_name).filter_by(id=course_id).first()
    if not course_info:
        return {"success": False, "message": f"Course ID '{course_id}' not found"}
    return {"success": True, "course_name": course_info[0]}


def get_available_roles() -> list[str]:
    """Returns a list of available roles"""
    return list(role_name.lower() for role_name in role_names.keys())
