"""API routes for user-related actions"""

from sqlalchemy.orm import Session
from fastapi import APIRouter, status, Depends
from backend.storage.database import get_db
from backend.models.user import User

user_router = APIRouter(prefix='/users')


@user_router.get('/all', status_code=status.HTTP_200_OK)
def get_all_users(db: Session = Depends(get_db)):
    all_users = db.query(User).all()
    return {'message': 'All users', 'data': all_users}
