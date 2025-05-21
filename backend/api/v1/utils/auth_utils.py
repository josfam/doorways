"""Password-related functions"""

import bcrypt
from typing import Optional
from fastapi import Header
from fastapi.responses import JSONResponse


def hash_password(password: str) -> str:
    """Hashed a password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt=salt).decode(encoding="utf-8")


def is_matching_password(password: str, hashed_password: str) -> bool:
    """Compares a password with its hashed version"""
    return bcrypt.checkpw(password.encode(), hashed_password.encode())


async def get_user_auth_token(authorization: Optional[str]) -> str:
    """
    Extracts the JWT token from the Authorization header.
    The token is expected to be in the format "Bearer <token>".
    """
    if authorization is None:
        return
    try:
        token = authorization.split(" ")[1]
    except IndexError:
        return ""
    return token
