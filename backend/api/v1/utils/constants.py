from enum import Enum


class RoleNumbers(Enum):
    ADMIN = 1
    LECTURER = 2
    STUDENT = 3
    SECURITY = 4


class TransitionTypes(Enum):
    ENTRY = 1
    EXIT = 2
