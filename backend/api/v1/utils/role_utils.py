"""For role-related functions"""

from sqlalchemy.orm import Session
from backend.schema_validation.user_validation import UserCreate
from backend.models.user import User
from backend.models.student import Student
from backend.models.lecturer import Lecturer
from backend.models.security_guard import SecurityGuard
from backend.models.sys_admin import SysAdmin
from backend.models.role import Role
from backend.api.v1.utils.constants import role_names
from .custom_exceptions import MissingUserAttributeError


def add_user_to_role_table(
    role_name: str, user_data: UserCreate, user: User, session: Session
) -> dict[str, bool | str]:
    """Adds a user to their respective role table, based on the role id"""

    if role_name not in role_names:
        return {"success": False, "message": "Role name is required"}

    if role_name == "student":
        course_name = user_data.course_name
        if not course_name:
            raise MissingUserAttributeError("Course name is required for a student")
        student = Student(user_id=user.id, course_id=course_id)
        print(
            f"Adding student with user ID: {user.id} and course ID: {course_id}"
        )  # DEBUG
        session.add(student)
        return {"success": True, "message": "Student added successfully"}
    elif role_name == "lecturer":
        faculty_id = user_data.faculty_id
        if not faculty_id:
            return {"success": False, "message": "Faculty for lecturer is required"}
            # raise MissingUserAttributeError("Faculty ID is required for a lecturer")
        lecturer = Lecturer(user_id=user.id, faculty_id=faculty_id)
        print(
            f"Adding lecturer with user ID: {user.id} and faculty ID: {faculty_id}"
        )  # DEBUG
        session.add(lecturer)
        return {"success": True, "message": "Lecturer added successfully"}
    elif role_name == "sys admin":
        sys_admin = SysAdmin(user_id=user.id)
        print(f"Adding sys admin with user ID: {user.id}")  # DEBUG
        session.add(sys_admin)
        return {"success": True, "message": "Admin added successfully"}
    elif role_name == "security guard":
        security_guard = SecurityGuard(
            user_id=user.id, security_company=user_data.security_company
        )
        print(
            f"Adding security guard with user ID: {user.id} and security company: {user_data.security_company}"
        )  # DEBUG
        session.add(security_guard)
        return {"success": True, "message": "Security guard added successfully"}
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


def get_available_roles() -> list[str]:
    """Returns a list of available roles"""
    return list(role_name.lower() for role_name in role_names.keys())
