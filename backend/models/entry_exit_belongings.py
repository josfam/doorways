"""Contains schemas for "entry-exit belongings"-related classes.
An entry-exit belonging represents a belonging that's recorded at the time
of entry or exit.
"""

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class EntryExitBelonging(Base):
    """Represents a belonging that is tied to a specific entry or exit event"""

    __tablename__ = 'entryExitBelongings'

    id = Column(Integer, primary_key=True, autoincrement=True)
    entry_exit_time_id = Column(
        Integer, ForeignKey('entryExitTimes.id'), nullable=False
    )
    belonging_id = Column(Integer, ForeignKey('belongings.id'), nullable=False)

    # relationships:
    # with entryExitTime
    entry_exit_times = relationship(
        'EntryExitTime', back_populates='entry_exit_belongings'
    )

    def __init__(self, entry_exit_time_id: int, belonging_id: int):
        """Initialize the EntryExitBelonging instance"""
        self.entry_exit_time_id = entry_exit_time_id
        self.belonging_id = belonging_id
