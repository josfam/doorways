"""Contains schemas for the base class from which all other models classes will
inherit.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base class for all model classes"""

    pass
