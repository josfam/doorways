"""For role-related functions"""

from sqlalchemy.orm import Session
from backend.schema_validation.user_validation import UserCreate
from backend.models.user import User
from backend.models.student import Student
from backend.models.lecturer import Lecturer
from backend.models.security_guard import SecurityGuard
from backend.models.admin import Admin
from backend.models.role import Role
from .custom_exceptions import MissingUserAttributeError


def add_user_to_role_table(
    role_id: int, user_data: UserCreate, user: User, session: Session
) -> bool:
    """Adds a user to their respective role table, based on the role id"""
    role_name = session.query(Role.name).filter(Role.id == role_id).first()[0]
    if role_name == "student":
        course_id = user_data.course_id
        if not course_id:
            raise MissingUserAttributeError("Course ID is required for a student")
        student = Student(user_id=user.id, course_id=course_id)
        session.add(student)
    elif role_name == "lecturer":
        faculty_id = user_data.faculty_id
        if not faculty_id:
            raise MissingUserAttributeError("Faculty ID is required for a lecturer")
        lecturer = Lecturer(user_id=user.id, faculty_id=faculty_id)
        session.add(lecturer)
    elif role_name == "admin":
        admin = Admin(user_id=user.id)
        session.add(admin)
    elif role_name == "security_guard":
        security_guard = SecurityGuard(user_id=user.id)
        session.add(security_guard)
    else:
        pass
