from enum import Enum


class TransitionTypes(Enum):
    ENTRY = 1
    EXIT = 2


role_names = {
    "sys admin": 1,
    "lecturer": 2,
    "student": 3,
    "security guard": 4,
    "admin": 5,
}
