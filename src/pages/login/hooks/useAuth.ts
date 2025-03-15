import { useState } from "react";
import ApiFactory from "@/fetcher/ApiFactory";

const useAuth = () => {
  const [user, setUser] = useState<null | { id: number; name: string }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const api = ApiFactory.getFetchManager();
      const response = await api.post<{ id: number; name: string }>("/auth/login", {
        username,
        password,
      });

      if (response.status === 200) {
        setUser(response.data);
        localStorage.setItem("authToken", JSON.stringify(response.data)); // JWT
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("authToken");
  };

  return { user, login, logout, isAuthenticated, loading, error };
};

export default useAuth;