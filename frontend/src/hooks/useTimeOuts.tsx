import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/types/types";

export const useCodeTimeOut = () => {
  const [codeTimeOut, setCodeTimeOut] = useState<number | null>(null);
  try {
    const token = localStorage.getItem("jwt_token");
    if (!token) return null;

    setCodeTimeOut(jwtDecode<JwtPayload>(token).code_time_out);
    return codeTimeOut;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};
