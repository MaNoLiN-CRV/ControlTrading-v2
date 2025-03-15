import { useEffect } from "react"
import ApiFactory from "./fetcher/ApiFactory"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@/pages/login/Login";
import ProtectedRoute from "./components/wrappers/ProtectedRoute";
import Dashboard from "./pages/dashboard/Dashboard";


function App() {
  useEffect(() => {
    ApiFactory.createApiFactory("Fetch", "https://ExpertLimsApi")
    return () => {
      console.log("App unmounted")
    }
  }, [])
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
