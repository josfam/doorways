"""API routes for code-generation and other related actions"""

from fastapi import APIRouter, status, WebSocket, WebSocketDisconnect, Depends
from fastapi.responses import JSONResponse
from typing import Dict
from backend.api.v1.utils.code_utils import code_manager
from backend.api.v1.utils.auth_utils import get_current_user
from backend.api.v1.utils.constants import TransitionTypes
from backend.storage.database import get_db
from backend.models.user import User
from backend.models.entry_exit_times import EntryExitTime
from sqlalchemy.orm import Session
from datetime import datetime as dt, timezone as tz


codes_router = APIRouter(prefix="/codes", tags=["codes"])

# store websocket connections per client
web_socket_connections: Dict[str, WebSocket] = {}
# code to email
code_to_email: Dict[str, str] = {}


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
def get_random_code(user: str = Depends(get_current_user)):
    """Get a random code from the pool of available codes"""
    # extract the user's information
    email = user.get("email")
    code = code_manager.get_code()
    # store email associated with the code
    if code is None:
        return {"message": "No codes available"}, status.HTTP_404_NOT_FOUND

    expiration_time = code_manager.expiration_time
    code_to_email[code] = email
    return {"random_code": code, "expiration_time": expiration_time}


@codes_router.post("/release-code/{code}", status_code=status.HTTP_200_OK)
async def release_code(code: str, db: Session = Depends(get_db)):
    """Release a code back to the pool of available codes"""

    def record_entry_time():
        user_email = code_to_email.get(code, None)
        if not user_email:
            return JSONResponse(
                content={"message": "Cannot record entry time! Try again."},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        user = db.query(User).filter_by(email=user_email).first()
        if not user:
            return JSONResponse(
                content={"message": "User not found! Try again."},
                status_code=status.HTTP_404_NOT_FOUND,
            )
        user_id = user.id
        transition_time = dt.now(tz.utc).isoformat()
        # check if this user has a previous entry in the database
        prev_record = (
            db.query(EntryExitTime)
            .filter_by(user_id=user_id)
            .order_by(EntryExitTime.time.desc())
            .first()
        )
        if prev_record:
            # determine whether it was an entry or exit
            prev_transition_type_id = prev_record.transition_type_id
            if prev_transition_type_id == TransitionTypes.ENTRY.value:
                # make this an exit
                transition_type_id = TransitionTypes.EXIT.value
            else:
                # make this an entry
                transition_type_id = TransitionTypes.ENTRY.value
            ...
        else:
            # create an entry of the "entry" type
            transition_type_id: int = TransitionTypes.ENTRY.value
        entry_exit_time = EntryExitTime(
            user_id=user_id,
            transition_type_id=transition_type_id,
            transition_time=transition_time,
        )
        db.add(entry_exit_time)
        db.commit()

    print(code_manager.codes_in_use, code_to_email)  # DEBUG
    if code_manager.release_code(code):
        # Notify the websocket if a client is listening for this code
        ws = web_socket_connections.get(code)
        if ws:
            record_entry_time()
            await ws.send_text(f"Code {code} processed successfully.")
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
