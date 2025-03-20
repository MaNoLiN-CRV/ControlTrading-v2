import { useState, useEffect } from "react";
import { useAuthContext } from "../login/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mt4Client, Mt4Licence, Mt4Product } from "@/entities/entities/client.entity";
import Navbar from "@/components/Navbar";
import ApiService from "@/services/CacheDecorator";
import useEventCallback from "@/hooks/useEventCallback";
import useSafeDispatch from "@/hooks/useSafeDispatch";

const Licenses = () => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [licenses, setLicenses] = useState<Mt4Licence[]>([]);
  const [clients, setClients] = useState<Mt4Client[]>([]);
  const [products, setProducts] = useState<Mt4Product[]>([]);
  const [search, setSearch] = useState("");

  const safeSetLicenses = useSafeDispatch(setLicenses);
  const safeSetClients = useSafeDispatch(setClients);
  const safeSetProducts = useSafeDispatch(setProducts);
  const safeSetSearch = useSafeDispatch(setSearch);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    } else {
      // Fetch licenses, clients, and products data
      fetchLicenses();
      fetchClients();
      fetchProducts();
    }
  }, [isAuthenticated, navigate]);

  const fetchLicenses = useEventCallback(async () => {
    const data = await ApiService.getLicenses();
    safeSetLicenses(data);
  });

  const fetchClients = useEventCallback(async () => {
    const data = await ApiService.getClients();
    safeSetClients(data);
  });

  const fetchProducts = useEventCallback(async () => {
    const data = await ApiService.getProducts();
    safeSetProducts(data);
  });

  const handleSearchChange = useEventCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    safeSetSearch(e.target.value);
  });

  const filteredLicenses = licenses.filter((license) =>
    clients.some(
      (client) =>
        client.idClient === license.idLicence &&
        client.Nombre.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-6">Licencias</h1>
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
                <th className="px-4 py-2">Licence</th>
                <th className="px-4 py-2">MT4</th>
                <th className="px-4 py-2">Cliente</th>
                <th className="px-4 py-2">Broker</th>
                <th className="px-4 py-2">Producto</th>
                <th className="px-4 py-2">Expiración</th>
              </tr>
            </thead>
            <tbody>
              {filteredLicenses.map((license) => {
                const client = clients.find((c) => c.idClient === license.idLicence);
                const product = products.find((p) => p.idProduct === license.idProduct);
                return (
                  <tr key={license.idLicence}>
                    <td className="border px-4 py-2">{license.idLicence}</td>
                    <td className="border px-4 py-2">{client?.MT4ID}</td>
                    <td className="border px-4 py-2">{client?.Nombre}</td>
                    <td className="border px-4 py-2">{client?.Broker}</td>
                    <td className="border px-4 py-2">{product?.Product}</td>
                    <td className="border px-4 py-2">{license.expiration.toString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Licenses;