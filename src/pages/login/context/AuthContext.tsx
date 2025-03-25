import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import useAuth from "../hooks/useAuth";
import { updateAuthToken } from "@/services/api";

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);
  const isInitializing = useRef(true);
  
  // Perform token verification only once at the beginning
  useEffect(() => {
    const checkToken = async () => {
      if (isInitializing.current) {
        isInitializing.current = false;
        try {
          await auth.verifyToken(true); 
          updateAuthToken();
        } catch (error) {
          console.error("Error verificando token:", error);
        } finally {
          setInitialCheckComplete(true);
        }
      }
    };
    
    checkToken();
  }, []);

  const enhancedAuth = {
    ...auth,
    login: async (...args: Parameters<typeof auth.login>) => {
      const result = await auth.login(...args);
      if (result) {
        updateAuthToken();
      }
      return result;
    },
    logout: () => {
      auth.logout();
      updateAuthToken(); 
    }
  };

  if (!initialCheckComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-white text-xl">Verificando sesión...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={enhancedAuth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};