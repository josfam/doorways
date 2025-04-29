"""
Short code manager for temporary access codes during check-in and check-out
"""

import random
from typing import List, Optional


class CodeManager:
    """
    Singleton for managing temporary access codes for check-in and check-out.
    """

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CodeManager, cls).__new__(cls)
            cls._instance._initialize_code_pools()
        return cls._instance

    def _initialize_code_pools(self):
        """Create pool of both used and unused codes"""
        self.codes_available: List[str] = [f"{i:02d}" for i in range(100)]
        self.codes_in_use: List[str] = []

    def get_code(self) -> Optional[str]:
        """
        Get a code from the pool of available codes.
        If no codes are available, return None.
        """
        if not len(self.codes_available):
            return None
        code = random.choice(self.codes_available)
        self.codes_available.remove(code)
        self.codes_in_use.append(code)
        return code

    def release_code(self, code: str) -> bool:
        """
        Release a code back to the pool of available codes.
        If the code is not in use, return False.
        """
        if code in self.codes_in_use:
            self.codes_in_use.remove(code)
            self.codes_available.append(code)
            return True
        return False

    def show_pool_stats(self) -> dict:
        """
        Show the current state of the code pools.
        """
        return {
            "codes_available": len(self.codes_available),
            "codes_in_use": len(self.codes_in_use),
        }
