import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import useSafeDispatch from "@/hooks/useSafeDispatch";
import useEventCallback from "@/hooks/useEventCallback";

const Login = () => {
  const { login, loading, error, isAuthenticated } = useAuthContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const safeSetUsername = useSafeDispatch(setUsername);
  const safeSetPassword = useSafeDispatch(setPassword);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Handle login
  const handleLogin = useEventCallback( async () => {
    await login(username, password);
  });

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="backdrop-blur-lg bg-white/10 p-6 sm:p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h1 className="text-4xl font-bold text-white text-center mb-6">Login</h1>
        <div className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => safeSetUsername(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => safeSetPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;