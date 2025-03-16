from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime as dt, timezone as tz
from .base import Base


class EntryExitTime(Base):
    """Represents time-based information that is added to an entry or an exit"""

    __tablename__ = 'entryExitTimes'

    id = Column(Integer, primary_key=True, autoincrement=True)
    userId = Column(Integer, ForeignKey('users.id'), nullable=False)
    transitionTypeId = Column(
        Integer, ForeignKey('transitionTypes.id'), nullable=False
    )
    time = Column(DateTime, nullable=False, default=dt.now(tz.utc))

    # relationships:
    # with transition type
    transition_type = relationship(
        'TransitionType', back_populates='entry_exit_times'
    )
    # with entry exit belongings
    entry_exit_belongings = relationship(
        'EntryExitBelonging', back_populates='entry_exit_times'
    )
