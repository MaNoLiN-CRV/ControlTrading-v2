import { useState, useEffect } from "react";
import { useAuthContext } from "../login/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Licence from "@/entities/Licence";
import Client from "@/entities/Client";
import Product from "@/entities/Product";
import Navbar from "@/components/Navbar";

const Licenses = () => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [licenses, setLicenses] = useState<Licence[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

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

  const fetchLicenses = async () => {
    // Fetch licenses data from API
    // Example: const response = await api.get<Licence[]>("/licenses");
    // setLicenses(response.data);
  };

  const fetchClients = async () => {
    // Fetch clients data from API
    // Example: const response = await api.get<Client[]>("/clients");
    // setClients(response.data);
  };

  const fetchProducts = async () => {
    // Fetch products data from API
    // Example: const response = await api.get<Product[]>("/products");
    // setProducts(response.data);
  };

  const filteredLicenses = licenses.filter((license) =>
    clients.some(
      (client) =>
        client.idClient === license.idLicence &&
        client.name.toLowerCase().includes(search.toLowerCase())
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
            onChange={(e) => setSearch(e.target.value)}
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
                const product = products.find((p) => p.idProduct === Number(license.product));
                return (
                  <tr key={license.idLicence}>
                    <td className="border px-4 py-2">{license.idLicence}</td>
                    <td className="border px-4 py-2">{client?.mt4Id}</td>
                    <td className="border px-4 py-2">{client?.name}</td>
                    <td className="border px-4 py-2">{client?.broker}</td>
                    <td className="border px-4 py-2">{product?.productName}</td>
                    <td className="border px-4 py-2">{license.expiration}</td>
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