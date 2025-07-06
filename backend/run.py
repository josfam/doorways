from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from backend.config import config
from backend.storage.database import create_tables, pre_populate_tables
from backend.api.v1.routers import sys_admin, user, codes, auth, statistics


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
main_router.include_router(statistics.stats_router)

app.include_router(main_router)

# CORS middleware
cors_origins = config.CORS_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def home():
    return {'message': 'Welcome to the doorways API'}
