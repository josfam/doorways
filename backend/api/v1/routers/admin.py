"""API routes for admin-related actions"""

from fastapi import APIRouter, status

admin_router = APIRouter(prefix="/admin", tags=["admin"])
