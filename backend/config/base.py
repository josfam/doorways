import os
from dotenv import load_dotenv

load_dotenv()


class BaseConfig:
    """Base configuration class."""

    # General
    SECRET_KEY = os.getenv("SECRET_KEY")

    # Database
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "5432")
    DB_NAME = os.getenv("DB_NAME", "doorways")
    DB_USER = os.getenv("DB_USER", "postgres")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "root")

    # code management
    CODE_EXPIRATION_TIME = int(os.getenv("CODE_EXPIRATION_TIME", 5))
    CODE_LENGTH = int(os.getenv("CODE_LENGTH", 2))
    POSSIBLE_CODES_AVAILABLE = int(os.getenv("POSSIBLE_CODES_AVAILABLE", 100))
    CODE_EXPIRY_CHECK_INTERVAL = int(os.getenv("CODE_EXPIRY_CHECK_INTERVAL", 2))

    # CORS
    CORS_ORIGINS = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:5173/,http://127.0.0.1:5173,http://127.0.0.1:5173/",
    ).split(",")

    # security
    JWT_EXPIRATION_TIME = int(os.getenv("JWT_EXPIRATION_TIME", 10800))  # in seconds
