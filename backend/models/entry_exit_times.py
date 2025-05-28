"""Contains schemas for "entry-exit times"-related classes.
An entry-exit time represents an entry or exit event, with more
information attached, including the time that this event was captured.
"""

from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime as dt, timezone as tz
from .base import Base


class EntryExitTime(Base):
    """Represents time-based information that is added to an entry or an exit"""

    __tablename__ = "entryExitTimes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    transition_type_id = Column(
        Integer, ForeignKey("transitionTypes.id"), nullable=False
    )
    time = Column(DateTime, nullable=False, default=dt.now(tz.utc))

    # relationships:
    # with transition type
    transition_type = relationship("TransitionType", back_populates="entry_exit_times")
    # with entry exit belongings
    entry_exit_belongings = relationship(
        "EntryExitBelonging", back_populates="entry_exit_times"
    )

    def __init__(
        self,
        user_id: int,
        transition_type_id: int,
        transition_time: dt = dt.now(tz.utc),
    ):
        """Initialize the EntryExitTime instance"""
        self.user_id = user_id
        self.transition_type_id = transition_type_id
        self.time = transition_time
