import csv
import sys
import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from dotenv import load_dotenv
from backend.models.sys_admin import SysAdmin
from backend.models.base import Base
from backend.models.belongings import Belonging
from backend.models.course import Course
from backend.models.entry_exit_belongings import EntryExitBelonging
from backend.models.entry_exit_times import EntryExitTime
from backend.models.faculty import Faculty
from backend.models.item import Item
from backend.models.lecturer import Lecturer
from backend.models.role import Role
from backend.models.security_guard import SecurityGuard
from backend.models.student import Student
from backend.models.transition_type import TransitionType
from backend.models.user import User

# load environment variables
load_dotenv()

db_port = int(os.getenv("DB_PORT")) or 5432
db_name = os.getenv("DB_NAME") or "doorways"
db_user = os.getenv("DB_USER")
db_host = os.getenv("DB_HOST") or "localhost"
db_password = os.getenv("DB_PASSWORD")
db_url = f"postgresql+psycopg2://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

if not db_user or not db_password:
    print("Database user or password not set in environment variables.")
    sys.exit(1)

engine = create_engine(url=db_url)

# scoped session for thread safety
session_factory = sessionmaker(bind=engine)
session_local = scoped_session(session_factory=session_factory)

# file operations
drop_tables_first = int(os.getenv("DROP_TABLES_FIRST", 0))

pre_population_dir = Path(__file__).resolve().parent / "pre_populated_content"


def get_db():
    """Yields a new database session to the caller"""
    session = session_local()
    try:
        yield session
    finally:
        session.close()


def create_tables():
    """Creates the tables / relations in the database"""
    if drop_tables_first:
        Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def pre_populate_faculties():
    """Pre-populate the faculties table with predefined faculties"""
    existing_faculties = session_local().query(Faculty).all()
    if existing_faculties:
        return

    faculty_file = pre_population_dir / "faculties.csv"
    with open(faculty_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        faculties = [Faculty(line["faculty name"]) for line in reader]
    session = session_local()
    try:
        session.add_all(faculties)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error inserting faculties to db: {e}")
    finally:
        session.close()


def pre_populate_courses():
    """Pre-populate the courses table with predefined courses"""
    existing_courses = session_local().query(Course).all()
    if existing_courses:
        return

    courses_file = pre_population_dir / "courses.csv"
    with open(courses_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        courses = [Course(line["course code"], line["course name"]) for line in reader]
    session = session_local()
    try:
        session.add_all(courses)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error inserting courses to db: {e}")
    finally:
        session.close()


def pre_populate_roles():
    """Pre-populate the roles table with predefined roles"""
    existing_roles = session_local().query(Role).all()
    if existing_roles:
        return

    roles_file = pre_population_dir / "roles.csv"
    with open(roles_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        roles = [Role(line["role name"]) for line in reader]
    session = session_local()
    try:
        session.add_all(roles)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error inserting roles to db: {e}")
    finally:
        session.close()


def pre_populate_transition_types():
    """Pre-populate the transition types table with predefined roles"""
    existing_transition_types = session_local().query(TransitionType).all()
    if existing_transition_types:
        return

    transition_types_file = pre_population_dir / "transition_types.csv"
    with open(transition_types_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        transition_types = [TransitionType(line["transition type"]) for line in reader]
    session = session_local()
    try:
        session.add_all(transition_types)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error inserting transition types to db: {e}")
    finally:
        session.close()


def pre_populate_tables():
    """Pre-populate the items table with predefined generic items"""
    pre_populate_faculties()
    pre_populate_courses()
    pre_populate_roles()
    pre_populate_transition_types()
