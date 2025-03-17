import { useEffect } from "react";
import ApiFactory from "./fetcher/ApiFactory";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/login/Login";
import ProtectedRoute from "./components/wrappers/ProtectedRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import Licenses from "./pages/licenses/Licenses";
import Products from "./pages/products/Products";

function App() {
  useEffect(() => {
    ApiFactory.createApiFactory("Fetch", "https://ExpertLimsApi");
    return () => {
      console.log("App unmounted");
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Redirect root ("/") to login */}
        <Route path="/" element={<Navigate to="/login" />} />
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
    </Router>
  );
}

export default App;
