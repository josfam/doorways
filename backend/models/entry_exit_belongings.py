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
    entryExitId = Column(
        Integer, ForeignKey('entryExitTimes.id'), nullable=False
    )
    belongingId = Column(Integer, ForeignKey('belongings.id'), nullable=False)

    # relationships:
    # with entryExitTime
    entry_exit_times = relationship(
        'EntryExitTime', back_populates='entry_exit_belongings'
    )
