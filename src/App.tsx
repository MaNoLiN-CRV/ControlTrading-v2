import { useEffect } from "react";
import ApiFactory from "./fetcher/ApiFactory";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "@/pages/login/Login";
import ProtectedRoute from "./components/wrappers/ProtectedRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import Licenses from "./pages/licenses/Licenses";
import Products from "./pages/products/Products";
import { useAuthContext } from "./pages/login/context/AuthContext";

function AppRoutes() {
  const { isTokenValid, loading } = useAuthContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isTokenValid === false && !loading) {
      navigate("/login");
    }
  }, [isTokenValid, loading, navigate]);
  
  if (loading || isTokenValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <Routes>
      {/* Redirect root ("/") to dashboard or login depending on auth state */}
      <Route 
        path="/" 
        element={isTokenValid ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/licenses"
        element={
          <ProtectedRoute>
            <Licenses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    ApiFactory.createApiFactory("Fetch", "http://localhost:3000/api");
    return () => {
      console.log("App unmounted");
    };
  }, []);

  return <AppRoutes />;
}

export default App;
