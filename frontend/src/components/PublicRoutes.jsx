// src/components/PublicRoutes.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0A0F]">
        <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Already logged in → dashboard pe bhejo
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};