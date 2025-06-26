"Route for statistics related to the application."

from fastapi import APIRouter, status, Depends
from fastapi.responses import JSONResponse
from backend.models.user import User
from backend.models.entry_exit_times import EntryExitTime
from backend.storage.database import get_db

stats_router = APIRouter(prefix="/stats", tags=["statistics"])


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
    history_entries = db.query(EntryExitTime).filter_by(user_id=user_id).all()
    if not len(history_entries):
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "You have no activity history yet."},
        )

    history = [entry.to_dict() for entry in history_entries]

    return JSONResponse(
        content={"message": f"Activity history for user {user_id}", "history": history},
        status_code=status.HTTP_200_OK,
    )
