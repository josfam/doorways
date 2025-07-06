from .base import BaseConfig


class DevelopmentConfig(BaseConfig):
    """
    Configuration for the development environment.
    """

    ENVIRONMENT = "development"
    DEBUG = True
    TESTING = False
    # Development-specific CORS
    CORS_ORIGINS = [
        "http://localhost:5173",
        "http://localhost:5173/",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5173/",
    ]
