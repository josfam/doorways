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


def get_db():
    """Yields a new database session to the caller"""
    session = session_local()
    try:
        yield session
    finally:
        session.close()


def create_tables():
    """Creates the tables / relations in the database"""
    Base.metadata.create_all(bind=engine)
