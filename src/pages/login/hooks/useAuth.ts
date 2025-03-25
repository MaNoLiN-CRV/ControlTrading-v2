import { useState, useEffect, useRef } from "react";
import useSafeDispatch from "@/hooks/useSafeDispatch";
import api from "@/services/api";

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
  const hasVerifiedToken = useRef(false);
  
  const safeSetUser = useSafeDispatch(setUser);
  const safeSetLoading = useSafeDispatch(setLoading);
  const safeSetError = useSafeDispatch(setError);
  const safeSetIsTokenValid = useSafeDispatch(setIsTokenValid);

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

  // Login
  const login = async (username: string, password: string) => {
    if (loading) return false; 
    
    safeSetLoading(true);
    safeSetError(null);

    try {
      const response = await api.post<LoginResponse>("/login", {
        username,
        password,
      } as LoginRequest);

      if (response.data.success && response.data.token && response.data.user) {
        localStorage.setItem("authToken", response.data.token);
        safeSetUser(response.data.user);
        safeSetIsTokenValid(true);
        hasVerifiedToken.current = true;
        return true;
      } else {
        throw new Error(response.data.message || "Credenciales inválidas");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      safeSetError(err.message || "Ocurrió un error al iniciar sesión");
      return false;
    } finally {
      safeSetLoading(false);
    }
  };

  // Logout
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