from backend.storage.database import create_tables, pre_populate_tables

from fastapi import FastAPI

# create all tables
create_tables()
pre_populate_tables()

app = FastAPI()


@app.get('/')
def home():
    return {'message': 'Welcome to the doorways API'}
