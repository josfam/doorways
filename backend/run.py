from backend.storage.database import create_tables, pre_populate_tables

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from backend.api.v1.routers import admin, user, codes


# create all tables
create_tables()
pre_populate_tables()

app = FastAPI()

# setup routers
main_router = APIRouter(prefix='/api/v1', tags=['main'])
main_router.include_router(admin.admin_router)
main_router.include_router(user.user_router)
main_router.include_router(codes.codes_router)

app.include_router(main_router)

# CORS middleware
origins = [
    'http://localhost:5173',
    'http://localhost:5173/',
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
