import os
from .production import ProductionConfig
from .development import DevelopmentConfig
from .base import BaseConfig


def get_config() -> ProductionConfig | DevelopmentConfig | BaseConfig:
    """Returns the configuration based on environment"""
    environment = os.getenv("ENVIRONMENT", "development").lower()

    if environment == "development":
        return DevelopmentConfig()
    elif environment == "production":
        return ProductionConfig()
    else:
        return BaseConfig()


config = get_config()
