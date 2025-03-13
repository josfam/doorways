from sqlalchemy import Column, Integer, String
from .base import Base


class Roles(Base):
    """User roles that exist in the application"""

    __tablename__ = 'roles'
    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    name = Column(String(160))
