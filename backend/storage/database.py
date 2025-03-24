import csv
import sys
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
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

db_port = '5432'
db_name = 'doorways'
db_user = 'postgres'
db_host = 'localhost'
db_password = 'root'
db_url = f'postgresql+psycopg2://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'

engine = create_engine(url=db_url)

# scoped session for thread safety
session_factory = sessionmaker(bind=engine)
session_local = scoped_session(session_factory=session_factory)

# file operations
drop_tables_first = True
pre_population_dir = Path.cwd() / 'storage' / 'pre_populated_content'


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
    faculty_file = pre_population_dir / 'faculties.csv'
    with open(faculty_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        faculties = [Faculty(line['faculty name']) for line in reader]
    session = session_local()
    try:
        session.add_all(faculties)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f'Error inserting faculties to db: {e}')
    finally:
        session.close()


def pre_populate_courses():
    """Pre-populate the courses table with predefined courses"""
    courses_file = pre_population_dir / 'courses.csv'
    with open(courses_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        courses = [
            Course(line['course code'], line['course name']) for line in reader
        ]
    session = session_local()
    try:
        session.add_all(courses)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f'Error inserting courses to db: {e}')
    finally:
        session.close()


def pre_populate_roles():
    """Pre-populate the roles table with predefined roles"""
    roles_file = pre_population_dir / 'roles.csv'
    with open(roles_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        roles = [Role(line['role name']) for line in reader]
    session = session_local()
    try:
        session.add_all(roles)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f'Error inserting roles to db: {e}')
    finally:
        session.close()


def pre_populate_transition_types():
    """Pre-populate the transition types table with predefined roles"""
    transition_types_file = pre_population_dir / 'transition_types.csv'
    with open(transition_types_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        transition_types = [
            TransitionType(line['transition type']) for line in reader
        ]
    session = session_local()
    try:
        session.add_all(transition_types)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f'Error inserting transition types to db: {e}')
    finally:
        session.close()


def pre_populate_tables():
    """Pre-populate the items table with predefined generic items"""
    pre_populate_faculties()
    pre_populate_courses()
    pre_populate_roles()
    pre_populate_transition_types()
