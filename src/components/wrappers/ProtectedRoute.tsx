import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/pages/login/context/AuthContext";

/**
 * A wrapper component that protects routes from unauthorized access
 * @param param0 
 * @returns 
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;