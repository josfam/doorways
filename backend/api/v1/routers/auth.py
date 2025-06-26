"""API routes for user authentication"""

import jwt
import os
from dotenv import load_dotenv
from datetime import datetime as dt, timezone as tz, timedelta
from fastapi import APIRouter, status, Depends
from fastapi.responses import JSONResponse
from backend.schema_validation.user_validation import LoginRequest
from sqlalchemy.orm import Session
from backend.storage.database import get_db
from backend.api.v1.utils.auth_utils import hash_password, is_matching_password
from backend.api.v1.utils.role_utils import get_role_name_from_id
from backend.models.user import User
from backend.api.v1.utils.code_utils import code_manager

auth_router = APIRouter(prefix="/auth", tags=["auth"])
TOKEN_EXPIRATION_TIME = 3600 * 3  # 3 hours
load_dotenv()


@auth_router.post("/login", status_code=status.HTTP_200_OK)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """Logs a user into the system"""
    email = credentials.email
    password = credentials.password

    # check if the user exists in the db
    existing_user = db.query(User).filter_by(email=email).first()
    if not existing_user:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "User not found"},
        )
    # check if the password is correct
    hashed_pwd = existing_user.password
    if not is_matching_password(password, hashed_pwd):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"message": "Incorrect username or password"},
        )

    # get the role name from the role id
    role_info = get_role_name_from_id(existing_user.role_id)
    if not role_info["success"]:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": role_info["message"]},
        )
    role_name = str(role_info["role_name"]).lower()

    # get the user's id
    user_id = existing_user.id

    # generate a JWT token
    jwt_payload = {
        "id": user_id,
        "email": existing_user.email,
        "role_name": role_name,
        "code_time_out": code_manager.code_expiration_time,
        "expiration": (
            dt.now(tz.utc) + timedelta(seconds=TOKEN_EXPIRATION_TIME)
        ).isoformat(),
    }
    secret_key = os.getenv("SECRET_KEY")
    jwt_token = jwt.encode(
        jwt_payload,
        secret_key,
        algorithm="HS256",
    )
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "message": "Login successful",
            "jwt_token": jwt_token,
        },
    )


@auth_router.post("/logout", status_code=status.HTTP_200_OK)
def logout():
    """Logs a user out of the system"""
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"message": "Logout successful"},
    )
