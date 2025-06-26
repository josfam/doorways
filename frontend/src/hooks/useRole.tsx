import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/types/types";

export const useRole = () => {
  const [role] = useState<string | null>(() => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) return null;

      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.role_name;
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return null;
    }
  });

  return role;
};

// Helper function to check specific roles
export const useIsRole = (targetRole: string) => {
  const role = useRole();

  return role === targetRole;
};

// Convenience hooks for common roles
export const useIsStudent = () => {
  return useIsRole("student");
};

export const useIsLecturer = () => {
  return useIsRole("lecturer");
};

export const useIsSysAdmin = () => {
  return useIsRole("sys_admin");
};

export const useIsSecurityGuard = () => {
  return useIsRole("security_guard");
};

export const useIsAdmin = () => {
  return useIsRole("admin");
};
