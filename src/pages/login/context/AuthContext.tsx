import React, { createContext, useContext, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);
  
  // Perform token verification only once at the beginning
  useEffect(() => {
    const checkToken = async () => {
      if (!initialCheckComplete) {
        await auth.verifyToken();
        setInitialCheckComplete(true);
      }
    };
    
    checkToken();
  }, [initialCheckComplete]);

  // Only render children after initial token check
  if (!initialCheckComplete && auth.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};