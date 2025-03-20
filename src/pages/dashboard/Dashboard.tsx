import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../login/context/AuthContext";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Licenses */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-3">Licencias</h2>
            <p className="text-gray-300 mb-4">Gestiona las licencias de los clientes y sus productos asociados.</p>
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
            <h2 className="text-xl font-semibold mb-3">Soporte Técnico</h2>
            <p className="text-gray-300 mb-4">Gestiona las solicitudes de soporte técnico de los clientes.</p>
            <button 
              onClick={() => navigate("/support")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Ver soporte
            </button>
          </div>
        </div>
        
        {/* Stats overview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Total Licencias</h3>
            <p className="text-3xl font-bold text-blue-500">--</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Total Clientes</h3>
            <p className="text-3xl font-bold text-green-500">--</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Total Productos</h3>
            <p className="text-3xl font-bold text-purple-500">--</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;