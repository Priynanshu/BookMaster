// src/hooks/useAuth.js
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, logoutUser, registerUser, clearError } from "../features/auth/authSlice";

// ── useAuth Hook ──────────────────────────────────────
// Har component mein auth logic repeat mat karo
// Ye hook use karo — sab ek jagah hai
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  );

  // Login function
  const login = async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      navigate("/"); // success → dashboard
    }
  };

  // Register function
  const register = async (userData) => {
    const result = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(result)) {
      navigate("/"); // success → dashboard
    }
  };

  // Logout function
  const logout = async () => {
    await dispatch(logoutUser());
    navigate("/login"); // logout → login page
  };

  // Clear error
  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearAuthError,
  };
};

export default useAuth;