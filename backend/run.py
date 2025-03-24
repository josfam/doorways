from backend.storage.database import create_tables, pre_populate_tables

from fastapi import FastAPI, APIRouter
from backend.api.v1.routers import admin, user


# create all tables
create_tables()
pre_populate_tables()

app = FastAPI()

# setup routers
main_router = APIRouter(prefix='/api/v1', tags=['main'])
main_router.include_router(admin.admin_router)
main_router.include_router(user.user_router)

app.include_router(main_router)


@app.get('/')
def home():
    return {'message': 'Welcome to the doorways API'}
