import { useState, useEffect, useRef } from "react";
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

interface VerifyResponse {
  isValid: boolean;
}

/**
 * This is a custom hook that handles authentication
 * @returns  {Object} user, login, logout, isAuthenticated, loading, error, verifyToken
 */
const useAuth = () => {
  const [user, setUser] = useState<null | AuthUser>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  // Ref to track if token has been verified in this session
  const hasVerifiedToken = useRef(false);
  
  const safeSetUser = useSafeDispatch(setUser);
  const safeSetLoading = useSafeDispatch(setLoading);
  const safeSetError = useSafeDispatch(setError);
  const safeSetIsTokenValid = useSafeDispatch(setIsTokenValid);

  // Verify token function - only call this explicitly when needed
  const verifyToken = async (force = false) => {
    if (hasVerifiedToken.current && !force) {
      return isTokenValid;
    }
    
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      safeSetIsTokenValid(false);
      hasVerifiedToken.current = true;
      return false;
    }

    try {
      safeSetLoading(true);
      const api = ApiFactory.createApiFactory("Fetch", "http://localhost:3000/api");
      const response = await api.get<VerifyResponse>("/verify");
      const isValid = response.data.isValid;
      
      safeSetIsTokenValid(isValid);
      hasVerifiedToken.current = true;
      
      if (!isValid) {
        localStorage.removeItem("authToken");
        safeSetUser(null);
      }
      
      return isValid;
    } catch (err) {
      console.error("Token verification failed:", err);
      safeSetIsTokenValid(false);
      localStorage.removeItem("authToken");
      safeSetUser(null);
      hasVerifiedToken.current = true;
      return false;
    } finally {
      safeSetLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    safeSetLoading(true);
    safeSetError(null);

    try {
      const api = ApiFactory.createApiFactory("Fetch", "http://localhost:3000/api");
      
      const response = await api.post<LoginResponse>("/login", {
        username,
        password,
      } as LoginRequest);

      if (response.data.success && response.data.token && response.data.user) {
        safeSetUser(response.data.user);
        localStorage.setItem("authToken", response.data.token);
        safeSetIsTokenValid(true);
        return true;
      } else {
        throw new Error(response.data.message || "Invalid credentials");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      safeSetError(err.message || "An error occurred");
      return false;
    } finally {
      safeSetLoading(false);
    }
  };

  const logout = () => {
    safeSetUser(null);
    localStorage.removeItem("authToken");
    safeSetIsTokenValid(false);
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("authToken");
  };

  return { 
    user, 
    login, 
    logout, 
    isAuthenticated, 
    loading, 
    error,
    verifyToken,
    isTokenValid
  };
};

export default useAuth;