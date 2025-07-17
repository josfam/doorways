"""API routes for user-related actions"""

from sqlalchemy.orm import Session
from fastapi import APIRouter, status, Depends
from fastapi.responses import JSONResponse
from typing import Union
from backend.storage.database import get_db
from backend.models.user import User
from backend.schema_validation.user_validation import (
    StudentRead,
    UserRead,
    LecturerRead,
    SecurityGuardRead,
)

user_router = APIRouter(prefix="/users")


@user_router.get("/all", status_code=status.HTTP_200_OK)
def get_all_users(db: Session = Depends(get_db)):
    all_users = db.query(User).all()
    return {"message": "All users", "data": all_users}


@user_router.get(
    "/profile/{user_id}", status_code=status.HTTP_200_OK, response_model=Union[UserRead]
)
def get_user_by_id(user_id: str, db: Session = Depends(get_db)):
    """Gets a user's details by their user id"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "User not found"},
        )
    user_details = user.to_dict()
    if "role name" not in user_details:
        user_details["role name"] = user.role.name
    return user_details
