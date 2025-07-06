from .base import BaseConfig
import os


class ProductionConfig(BaseConfig):
    "Production config"

    CODE_EXPIRATION_TIME = int(os.getenv("CODE_EXPIRATION_TIME", 10))  # seconds
    ENVIRONMENT = "production"
    DEBUG = False
