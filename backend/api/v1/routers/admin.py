"""API routes for admin-related actions"""

from sqlalchemy.orm import Session
from typing import List
from fastapi import APIRouter, status, Depends
from backend.storage.database import get_db
from backend.api.v1.auth.passwords import hash_password
from backend.models.user import User
from backend.schema_validation.user_validation import UserCreate, UserRead
from backend.api.v1.utils.roles import add_user_to_role_table
from backend.api.v1.utils.custom_exceptions import MissingUserAttributeError

admin_router = APIRouter(prefix="/admin", tags=["admin"])


@admin_router.post('/user', status_code=status.HTTP_201_CREATED)
def add_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Adds one user to the database"""
    # create a default password for this user if none has been provided
    if not len(user_data.password):
        password = (
            user_data.email.split('@')[0] + user_data.given_name
        ).lower()
        hashed_pwd = hash_password(password)
    else:
        hashed_pwd = hash_password(user_data.password)
    existing_email = (
        db.query(User.email).filter(User.email == user_data.email).first()
    )
    if existing_email:
        return {'message': 'User already exists'}, status.HTTP_409_CONFLICT

    new_user = User(
        user_data.email,
        user_data.surname,
        user_data.given_name,
        user_data.phone_number,
        user_data.role_id,
        password=hashed_pwd,
    )

    try:
        db.add(new_user)
        add_user_to_role_table(
            role_id=user_data.role_id,
            user_data=user_data,
            user=new_user,
            session=db,
        )
        db.commit()
    except MissingUserAttributeError as e:
        db.rollback()
        return {'message': str(e)}, status.HTTP_400_BAD_REQUEST
    except Exception as e:
        db.rollback()
        return {'message': str(e)}, status.HTTP_500_INTERNAL_SERVER_ERROR

    return {'message': 'User added successfully'}, status.HTTP_201_CREATED


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


@admin_router.get(
    '/users', status_code=status.HTTP_200_OK, response_model=List[UserRead]
)
def get_users(db: Session = Depends(get_db)):
    """Returns all users in the database"""
    users = db.query(User).all()
    if not users:
        return {'message': 'No users found'}, status.HTTP_404_NOT_FOUND
    return [UserRead.model_validate(user) for user in users]
