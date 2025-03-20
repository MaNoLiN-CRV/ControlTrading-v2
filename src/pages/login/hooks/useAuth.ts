import { useState } from "react";
import ApiFactory from "@/fetcher/ApiFactory";
import useSafeDispatch from "@/hooks/useSafeDispatch";

interface LoginRequest {
  username: string;
  password: string;
}

interface AuthUser {
  id: number;
  name: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  message?: string;
}

/**
 * This is a custom hook that handles authentication
 * @returns  {Object} user, login, logout, isAuthenticated, loading, error
 */
const useAuth = () => {
  const [user, setUser] = useState<null | AuthUser>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const safeSetUser = useSafeDispatch(setUser);
  const safeSetLoading = useSafeDispatch(setLoading);
  const safeSetError = useSafeDispatch(setError);

  const login = async (username: string, password: string) => {
    safeSetLoading(true);
    safeSetError(null);

    try {
      const api = ApiFactory.createApiFactory("Fetch", "http://localhost:3000/api");
      
      console.log("Attempting login with:", { username });
      
      const response = await api.post<LoginResponse>("/login", {
        username,
        password,
      } as LoginRequest);
      
      console.log("Login response:", response);

      if (response.data.success && response.data.token && response.data.user) {
        safeSetUser(response.data.user);
        localStorage.setItem("authToken", response.data.token);
      } else {
        throw new Error(response.data.message || "Invalid credentials");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        safeSetError("Network error: Cannot connect to server");
      } else {
        safeSetError(err.message || "An error occurred");
      }
    } finally {
      safeSetLoading(false);
    }
  };

  const logout = () => {
    safeSetUser(null);
    localStorage.removeItem("authToken");
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("authToken");
  };

  return { user, login, logout, isAuthenticated, loading, error };
};

export default useAuth;