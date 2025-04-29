"""API routes for code-generation and other related actions"""

from fastapi import APIRouter, status
from backend.api.v1.utils.code_utils import code_manager

codes_router = APIRouter(prefix="/codes", tags=["codes"])


@codes_router.get('/random-code', status_code=status.HTTP_200_OK)
def get_random_code():
    """Get a random code from the pool of available codes"""
    code = code_manager.get_code()
    if code is None:
        return {'message': 'No codes available'}, status.HTTP_404_NOT_FOUND
    return {'random_code': code}, status.HTTP_200_OK


@codes_router.post('/release-code/{code}', status_code=status.HTTP_200_OK)
def release_code(code: str):
    """Release a code back to the pool of available codes"""
    if code_manager.release_code(code):
        return {'message': 'Code released successfully'}, status.HTTP_200_OK
    return {'message': 'Code not in use'}, status.HTTP_404_NOT_FOUND


@codes_router.get('/codes-stats', status_code=status.HTTP_200_OK)
def show_pool_stats():
    """Show the current state of the code pools"""
    stats = code_manager.show_pool_stats()
    return stats, status.HTTP_200_OK


@codes_router.post('/reset-codes', status_code=status.HTTP_200_OK)
def reset_codes():
    """Reset the code pools"""
    code_manager._initialize_code_pools()
    return {'message': 'Code pools reset successfully'}, status.HTTP_200_OK
