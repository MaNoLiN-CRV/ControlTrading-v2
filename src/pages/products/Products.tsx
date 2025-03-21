import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../login/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mt4Product } from "@/entities/entities/client.entity";
import Navbar from "@/components/Navbar";
import ApiService from "@/services/CacheDecorator";
import useEventCallback from "@/hooks/useEventCallback";
import useSafeDispatch from "@/hooks/useSafeDispatch";

const Products = () => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Mt4Product[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const dataFetchedRef = useRef(false);

  const safeSetProducts = useSafeDispatch(setProducts);
  const safeSetSearch = useSafeDispatch(setSearch);
  const safeSetIsLoading = useSafeDispatch(setIsLoading);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    } else {
      if (!dataFetchedRef.current || products.length === 0) {
        fetchProducts();
      } else {
        safeSetIsLoading(false);
      }
    }
  }, [isAuthenticated, navigate, products.length]);

  const fetchProducts = useEventCallback(async () => {
    if (dataFetchedRef.current && products.length > 0) return;
    
    safeSetIsLoading(true);
    try {
      const data = await ApiService.getProducts();
      safeSetProducts(data);
      dataFetchedRef.current = true;
    } catch (error) {
      console.error("Error fetching products:", error);
      dataFetchedRef.current = false;
    } finally {
      safeSetIsLoading(false);
    }
  });

  const handleSearchChange = useEventCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    safeSetSearch(e.target.value);
  });

  const handleDaysDemoChange = useEventCallback((id: number, value: string) => {
    safeSetProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.idProduct === id ? { ...product, DemoDays: parseInt(value) || 0 } : product
      )
    );
    // TODO: Implement debounced API update instead of on every change
  });

  const filteredProducts = products.filter((product) =>
    product.Product.toLowerCase().includes(search.toLowerCase())
  );

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
                    <td className="border px-4 py-2">{product.Product}</td>
                    <td className="border px-4 py-2">{product.version}</td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={product.DemoDays}
                        onChange={(e) => handleDaysDemoChange(product.idProduct, e.target.value)}
                        className="w-full px-2 py-1 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <a
                        href={product.link}
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
        )}
      </main>
    </div>
  );
};

export default Products;