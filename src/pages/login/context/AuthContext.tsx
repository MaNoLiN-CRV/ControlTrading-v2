import React, { createContext, useContext, useEffect } from "react";
import useAuth from "../hooks/useAuth";

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  useEffect(() => {
    const checkInitialToken = async () => {
      await auth.verifyToken();
    };
    
    checkInitialToken();
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};