import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    navigate("/", {
      state: { showSuccessToast: true },
      replace: true,
    });
  };
  return handleLogout;
};
