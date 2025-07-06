"""
Short code manager for temporary access codes during check-in and check-out
"""

import random
import time
import os
import threading
from typing import List, Optional, Dict
from dotenv import load_dotenv

load_dotenv()


class CodeManager:
    """
    Singleton for managing temporary access codes for check-in and check-out.
    """

    _instance = None
    CODE_EXPIRATION_TIME = os.getenv("DEFAULT_CODE_EXPIRATION") or 8  # seconds
    CODE_EXPIRY_CHECK_INTERVAL = os.getenv("CODE_EXPIRY_CHECK_INTERVAL") or 2  # seconds
    POSSIBLE_CODES_AVAILABLE = (
        os.getenv("POSSIBLE_CODES_AVAILABLE") or 100
    )  # total codes available

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CodeManager, cls).__new__(cls)
            cls._instance._initialize_code_pools()
            cls._instance._start_code_expiry_checker()
        return cls._instance

    @property
    def code_expiration_time(self) -> int:
        """
        Get the expiration time for the codes.
        """
        return int(self.CODE_EXPIRATION_TIME)

    def _initialize_code_pools(self):
        """Create pool of both used and unused codes"""
        self.codes_available: List[str] = [
            f"{i:02d}" for i in range(int(self.POSSIBLE_CODES_AVAILABLE))
        ]
        self.codes_in_use: List[str] = []
        self.code_issue_timestamps: Dict[str, float] = {}  # when codes were issued
        self._lock = threading.RLock()  # thread safety

    def _start_code_expiry_checker(self):
        """Starts the background thread that checks for expired codes"""
        self._expiry_thread = threading.Thread(
            target=self._check_expired_codes, daemon=True
        )
        self._expiry_thread.start()

    def _check_expired_codes(self):
        """Checks for expired codes"""
        while True:
            time.sleep(
                int(self.CODE_EXPIRY_CHECK_INTERVAL)
            )  # check withing a given time
            self._release_expired_codes()

    def _release_expired_codes(self):
        """ "Releases codes that have been used back into the available pool"""
        current_time = time.time()
        expired_codes = []

        with self._lock:
            for code, timestamp in self.code_issue_timestamps.items():
                if (current_time - timestamp) > int(self.CODE_EXPIRATION_TIME):
                    expired_codes.append(code)

            for code in expired_codes:
                if code in self.codes_in_use:
                    self.codes_in_use.remove(code)
                    self.codes_available.append(code)
                    del self.code_issue_timestamps[code]

    def get_code(self) -> Optional[str]:
        """
        Get a code from the pool of available codes.
        If no codes are available, return None.
        """
        with self._lock:
            if not len(self.codes_available):
                return None

            code = random.choice(self.codes_available)
            self.codes_available.remove(code)
            self.codes_in_use.append(code)
            self.code_issue_timestamps[code] = (
                time.time()
            )  # record when this code was issued

            return code

    def release_code(self, code: str) -> bool:
        """
        Release a code back to the pool of available codes.
        If the code is not in use, return False.
        """
        with self._lock:
            if self.codes_in_use and code in self.codes_in_use:
                self.codes_in_use.remove(code)
                self.codes_available.append(code)
                # clean up timestamps
                if code in self.code_issue_timestamps:
                    del self.code_issue_timestamps[code]
                return True
            return False

    def show_pool_stats(self) -> dict:
        """
        Show the current state of the code pools.
        """
        return {
            "codes_available_count": len(self.codes_available),
            "codes_used_count": len(self.codes_in_use),
            "codes_used": [code for code in self.codes_in_use],
        }

    @property
    def expiration_time(self) -> int:
        """
        Get the expiration time for the codes.
        """
        return self.CODE_EXPIRATION_TIME


# instantiate the CodeManager, for use as a singleton
code_manager = CodeManager()
