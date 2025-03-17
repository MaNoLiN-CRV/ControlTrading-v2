import { useState, useEffect } from "react";
import { useAuthContext } from "../login/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Product from "@/entities/Product";
import Navbar from "@/components/Navbar";
import ApiService from "@/services/CacheDecorator";
import useEventCallback from "@/hooks/useEventCallback";
import useSafeDispatch from "@/hooks/useSafeDispatch";

const Products = () => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const safeSetProducts = useSafeDispatch(setProducts);
  const safeSetSearch = useSafeDispatch(setSearch);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    } else {
      fetchProducts();
    }
  }, [isAuthenticated, navigate]);

  const fetchProducts = useEventCallback(async () => {
    const data = await ApiService.getProducts();
    safeSetProducts(data);
  });

  const handleSearchChange = useEventCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    safeSetSearch(e.target.value);
  });

  const handleDaysDemoChange = useEventCallback((id: number, value: string) => {
    safeSetProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.idProduct === id ? { ...product, daysDemo: value } : product
        // TODO : Update the product in the backend
      )
    );
  });

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-6">Productos</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg">
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
                <tr key={product.idProduct}>
                  <td className="border px-4 py-2">{product.productName}</td>
                  <td className="border px-4 py-2">{product.version}</td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      value={product.demoDays}
                      onChange={(e) => handleDaysDemoChange(product.idProduct, e.target.value)}
                      className="w-full px-2 py-1 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <a
                      href={product.downloadLink}
                      className="text-blue-500 hover:text-blue-700"
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
      </main>
    </div>
  );
};

export default Products;