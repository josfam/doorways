import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/types/types";

export const useUserInfo = () => {
  const [userInfo] = useState<JwtPayload | null>(() => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) return null;

      const decoded = jwtDecode<JwtPayload>(token);
      return decoded;
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return null;
    }
  });

  return userInfo;
};
