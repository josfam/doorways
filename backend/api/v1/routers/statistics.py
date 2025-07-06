"Route for statistics related to the application."

from datetime import datetime as dt, timezone as tz, timedelta
from fastapi import APIRouter, status, Depends
from fastapi.responses import JSONResponse
from backend.models.user import User
from backend.models.entry_exit_times import EntryExitTime
from backend.storage.database import get_db

stats_router = APIRouter(prefix="/stats", tags=["statistics"])

EAT_TIMEZOME_OFFSET = 3


@stats_router.get("/activity-history/user/{user_id}", status_code=status.HTTP_200_OK)
def get_user_activity_history(user_id: str, db=Depends(get_db)):
    """Get the entry and exit history of a specific user."""
    # check if this user exists
    existing_user = db.query(User).filter_by(id=user_id).first()

    if not existing_user:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "User not found"},
        )

    # Get user's entry and exit entries
    from sqlalchemy import desc

    history_entries = (
        db.query(EntryExitTime)
        .filter_by(user_id=user_id)
        .order_by(desc(EntryExitTime.time))
        .all()
    )
    if not len(history_entries):
        return JSONResponse(
            content={"message": "No history found.", "data": []},
        )

    history = []

    # add offset to UTC+3 (East African Time)
    utc_plus_3 = tz(timedelta(hours=EAT_TIMEZOME_OFFSET))
    for entry in history_entries:
        # convert the time to East African Time
        entry_dict = entry.to_dict()
        utc_time_str = entry_dict["time"]
        utc_time = dt.fromisoformat(utc_time_str)
        local_time = utc_time.astimezone(utc_plus_3)
        entry_dict["time"] = local_time.isoformat()
        history.append(entry_dict)

    return JSONResponse(
        content={"message": f"Activity history for user {user_id}", "data": history},
        status_code=status.HTTP_200_OK,
    )
