import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../login/context/AuthContext";
import Navbar from "@/components/Navbar";
import CacheDecorator from "@/services/CacheDecorator";
import type StatsOverview from "@/entities/StatsOverview";

const Dashboard = () => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsOverview>({
    activeLicences: 0,
    totalLicences: 0,
    totalProducts: 0,
    totalClients: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await CacheDecorator.getStatsOverview();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-6">Dashboard</h1>
        
        <div className="grid mt-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Licenses */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-3">Licencias</h2>
            <p className="text-gray-300 mb-4">Gestiona las licencias , clientes y productos asociados.</p>
            <button 
              onClick={() => navigate("/licenses")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Ver licencias
            </button>
          </div>
          
          {/* Card 2: Products */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-3">Productos</h2>
            <p className="text-gray-300 mb-4">Administra los productos disponibles y sus versiones.</p>
            <button 
              onClick={() => navigate("/products")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Ver productos
            </button>
          </div>
          
          {/* Card 3: Support */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-3">Trading Station</h2>
            <p className="text-gray-300 mb-4">Gestiona las licencias v2</p>
            <button 
              onClick={() => navigate("/trading-station")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Ver licencias v2
            </button>
          </div>
        </div>
        
        {/* Stats overview with glassmorphism */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="backdrop-blur-lg bg-white/10 p-6 rounded-xl border border-white/20 shadow-lg transition-all duration-300 hover:bg-white/[0.15] group">
            <h3 className="text-lg font-medium mb-2 text-gray-300 group-hover:text-white transition-colors">
              Licencias Activas
            </h3>
            <p className="text-3xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
              {isLoading ? "..." : stats.activeLicences}
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/10 p-6 rounded-xl border border-white/20 shadow-lg transition-all duration-300 hover:bg-white/[0.15] group">
            <h3 className="text-lg font-medium mb-2 text-gray-300 group-hover:text-white transition-colors">
              Total Licencias
            </h3>
            <p className="text-3xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
              {isLoading ? "..." : stats.totalLicences}
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/10 p-6 rounded-xl border border-white/20 shadow-lg transition-all duration-300 hover:bg-white/[0.15] group">
            <h3 className="text-lg font-medium mb-2 text-gray-300 group-hover:text-white transition-colors">
              Total Clientes
            </h3>
            <p className="text-3xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
              {isLoading ? "..." : stats.totalClients}
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/10 p-6 rounded-xl border border-white/20 shadow-lg transition-all duration-300 hover:bg-white/[0.15] group">
            <h3 className="text-lg font-medium mb-2 text-gray-300 group-hover:text-white transition-colors">
              Total Productos
            </h3>
            <p className="text-3xl font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
              {isLoading ? "..." : stats.totalProducts}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;