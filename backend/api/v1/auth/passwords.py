"""Password-related functions"""

import bcrypt


def hash_password(password: str) -> str:
    """Hashed a password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt=salt).decode(encoding='utf-8')


def is_matching_password(password: str, hashed_password: str) -> bool:
    """Compares a password with its hashed version"""
    return bcrypt.checkpw(password.encode(), hashed_password.encode())
