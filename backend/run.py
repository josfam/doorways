from backend.storage.database import create_tables, pre_populate_tables

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from backend.api.v1.routers import sys_admin, user, codes, auth


# create all tables
create_tables()
pre_populate_tables()

app = FastAPI()

# setup routers
main_router = APIRouter(prefix='/api/v1', tags=['main'])
main_router.include_router(sys_admin.sys_admin_router)
main_router.include_router(user.user_router)
main_router.include_router(codes.codes_router)
main_router.include_router(auth.auth_router)

app.include_router(main_router)

# CORS middleware
origins = [
    'http://localhost:5173',
    'http://localhost:5173/',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5173/',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def home():
    return {'message': 'Welcome to the doorways API'}
