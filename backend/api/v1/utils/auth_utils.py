"""Password-related functions"""

import jwt
import os
import bcrypt
from typing import Optional, Union
from fastapi import Depends, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from backend.schema_validation.user_validation import (
    UserCreate,
    LecturerCreate,
    StudentCreate,
    SecurityGuardCreate,
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def hash_password(password: str) -> str:
    """Hashed a password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt=salt).decode(encoding="utf-8")


def is_matching_password(password: str, hashed_password: str) -> bool:
    """Compares a password with its hashed version"""
    return bcrypt.checkpw(password.encode(), hashed_password.encode())


def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """
    Decodes the JWT token and returns the user information.
    Raises an error if the token is invalid or expired.
    """
    secret_key = os.getenv("SECRET_KEY")
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])
        email: str = payload.get("email")
        if email is None:
            raise credentials_exception
        return {"email": email}
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise credentials_exception


def create_default_password(
    user_data: Union[StudentCreate, UserCreate, LecturerCreate, SecurityGuardCreate],
    email: Optional[str] = None,
) -> str:
    """Creates a default password for a user based on their data."""
    password = ""
    if email is not None:
        password = (email.split("@")[0] + user_data.given_name).lower()
    else:
        # security guards do not have an email
        password = user_data.given_name.lower() + user_data.surname.lower()
    return hash_password(password)
