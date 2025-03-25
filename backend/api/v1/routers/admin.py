"""API routes for admin-related actions"""

from sqlalchemy.orm import Session
from fastapi import APIRouter, status, Depends
from backend.storage.database import get_db

admin_router = APIRouter(prefix="/admin", tags=["admin"])


@admin_router.post('/user', status_code=status.HTTP_201_CREATED)
def add_user(db: Session = Depends(get_db)):
    """Adds one user to the database"""
    pass


@admin_router.post('/users', status_code=status.HTTP_200_OK)
def add_users(db: Session = Depends(get_db)):
    """Adds multiple users to the database"""
    pass


@admin_router.delete('/user/{user_id}', status_code=status.HTTP_200_OK)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Deletes a user from the database"""
    pass


@admin_router.patch('/user/{user_id}', status_code=status.HTTP_200_OK)
def update_user(user_id: int, db: Session = Depends(get_db)):
    """Updates a user's details"""
    pass
