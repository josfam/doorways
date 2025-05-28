"""API routes for code-generation and other related actions"""

from fastapi import APIRouter, status, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from typing import Dict
from backend.api.v1.utils.code_utils import code_manager

codes_router = APIRouter(prefix="/codes", tags=["codes"])

# store websocket connections per client
web_socket_connections: Dict[str, WebSocket] = {}


@codes_router.websocket("/ws/{code}")
async def websocket_endpoint(websocket: WebSocket, code: str):
    """WebSocket endpoint to handle code requests"""
    await websocket.accept()
    web_socket_connections[code] = websocket
    try:
        while True:
            await websocket.receive_text()  # Keep the connection alive
    except WebSocketDisconnect:
        del web_socket_connections[code]
        print(f"WebSocket connection for code {code} closed.")  # DEBUG


@codes_router.get("/random-code", status_code=status.HTTP_200_OK)
def get_random_code():
    """Get a random code from the pool of available codes"""
    code = code_manager.get_code()
    expiration_time = code_manager.expiration_time
    if code is None:
        return {"message": "No codes available"}, status.HTTP_404_NOT_FOUND
    return {"random_code": code, "expiration_time": expiration_time}


@codes_router.post("/release-code/{code}", status_code=status.HTTP_200_OK)
async def release_code(code: str):
    """Release a code back to the pool of available codes"""
    print(code_manager.codes_in_use)  # DEBUG
    if code_manager.release_code(code):
        # Notify the websocket if a client is listening for this code
        ws = web_socket_connections.get(code)
        if ws:
            await ws.send_text(f"Code {code} has been released back to the pool.")
        return JSONResponse(
            content={"message": f"Code {code} released successfully"},
            status_code=status.HTTP_200_OK,
        )
    return JSONResponse(
        content={"message": f"Code {code} not in use"},
        status_code=status.HTTP_404_NOT_FOUND,
    )


@codes_router.get("/codes-stats", status_code=status.HTTP_200_OK)
def show_pool_stats():
    """Show the current state of the code pools"""
    stats = code_manager.show_pool_stats()
    return stats, status.HTTP_200_OK


@codes_router.post("/reset-codes", status_code=status.HTTP_200_OK)
def reset_codes():
    """Reset the code pools"""
    code_manager._initialize_code_pools()
    return {"message": "Code pools reset successfully"}, status.HTTP_200_OK
