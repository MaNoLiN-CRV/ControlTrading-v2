import { useEffect } from "react";
import { useAuthContext } from "../login/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useProductsData } from "./hooks/useProductsData";
import { useProductsSearch } from "./hooks/useProductsSearch";

const Products = () => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  
  const { products, isLoading, fetchProducts, updateProductDemoDays } = useProductsData();
  const { search, handleSearchChange, filteredProducts } = useProductsSearch(products);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    } else {
      fetchProducts();
    }
  }, [isAuthenticated, navigate, fetchProducts]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar />
      <main className="w-full p-4">
        <h1 className="text-4xl font-bold text-center mb-6">Productos</h1>
        <div className="mb-4 px-4 max-w-5xl mx-auto">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="text-white text-xl">Cargando productos...</div>
          </div>
        ) : (
          <div className="overflow-x-auto px-4">
            <table className="min-w-full bg-gray-800/70 backdrop-blur-md rounded-lg shadow-xl border border-gray-700/50">
              <thead>
                <tr>
                  <th className="px-4 py-2">Producto</th>
                  <th className="px-4 py-2">Versión</th>
                  <th className="px-4 py-2">Días Demo</th>
                  <th className="px-4 py-2">Descargar</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.idProduct} className="hover:bg-gray-700/50">
                    <td className="border border-gray-700/40 px-4 py-2">{product.Product}</td>
                    <td className="border border-gray-700/40 px-4 py-2">{product.version}</td>
                    <td className="border border-gray-700/40 px-4 py-2">
                      <input
                        type="text"
                        value={product.DemoDays}
                        onChange={(e) => updateProductDemoDays(product.idProduct, e.target.value)}
                        className="w-full px-2 py-1 bg-gray-700/80 text-white rounded-lg border border-gray-600/80 focus:outline-none focus:ring-2 focus:ring-blue-500/70 backdrop-blur-sm transition"
                      />
                    </td>
                    <td className="border border-gray-700/40 px-4 py-2">
                      <a
                        href={product.link}
                        className="text-blue-500 hover:text-blue-300 transition"
                        download
                      >
                        Descargar EX4
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;