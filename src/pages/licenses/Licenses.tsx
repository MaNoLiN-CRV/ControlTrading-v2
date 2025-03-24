import { Suspense, useState, useMemo } from "react";
import { useAuthContext } from "../login/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { FixedSizeList as VirtualizedList } from "react-window";
import useLicensesData from "./hooks/useLicensesData";
import useSearchAndPagination from "./hooks/useSearchAndPagination";
import { LicenseFilterCombobox } from "./components/ComboBox";

const Licenses = () => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const { licenses, clients, products, isLoading, isAllLoaded } = useLicensesData();
  const [filterType, setFilterType] = useState("");

  // Function to sort licenses by idLicence in descending order
  const sortLicensesById = (a: any, b: any) => b.idLicence - a.idLicence;

  // Filtrar opciones para el ComboBox
  const filterOptions = useMemo(() => [
    { value: "all", label: "Todos los campos" },
    { value: "mt4id", label: "MT4 ID" },
    { value: "nombre", label: "Nombre de Cliente" },
    { value: "broker", label: "Broker" },
    { value: "producto", label: "Producto" },
  ], []);

  // Función personalizada para filtrar licencias según el tipo de filtro
  const customFilterFunction = (item: any, searchText: string) => {
    if (!searchText) return true;
    
    const lowercaseSearch = searchText.toLowerCase();
    const client = clients.find(c => c.idClient === item.idClient);
    const product = products.find(p => p.idProduct === item.idProduct);
    
    switch (filterType) {
      case "mt4id":
        return client?.MT4ID?.toLowerCase().includes(lowercaseSearch) || false;
      case "nombre":
        return client?.Nombre?.toLowerCase().includes(lowercaseSearch) || false;
      case "broker":
        return client?.Broker?.toLowerCase().includes(lowercaseSearch) || false;
      case "producto":
        return product?.Product?.toLowerCase().includes(lowercaseSearch) || false;
      default: 
        return (
          String(item.idLicence).includes(lowercaseSearch) ||
          client?.MT4ID?.toLowerCase().includes(lowercaseSearch) ||
          client?.Nombre?.toLowerCase().includes(lowercaseSearch) ||
          client?.Broker?.toLowerCase().includes(lowercaseSearch) ||
          product?.Product?.toLowerCase().includes(lowercaseSearch) ||
          false
        );
    }
  };

  const {
    search,
    currentPage,
    totalPages,
    paginatedItems: paginatedLicenses,
    handleSearchChange,
    setCurrentPage,
  } = useSearchAndPagination(licenses, 20, sortLicensesById, customFilterFunction);

  if (!isAuthenticated()) {
    navigate("/login");
    return null;
  }

  const tableData = paginatedLicenses.map((license) => {
    const client = clients.find((c) => c.idClient === license.idClient);
    const product = products.find((p) => p.idProduct === license.idProduct);
    return {
      id: license.idLicence,
      columns: [
        { value: license.idLicence },
        { value: client?.MT4ID || "-" },
        { value: client?.Nombre || "-" },
        { value: client?.Broker || "-" },
        { value: product?.Product || "-" },
        { value: license.expiration.toString() },
      ],
    };
  });

  // Placeholders for search input
  const getSearchPlaceholder = () => {
    switch (filterType) {
      case "mt4id": return "Buscar por MT4 ID...";
      case "nombre": return "Buscar por nombre de cliente...";
      case "broker": return "Buscar por broker...";
      case "producto": return "Buscar por producto...";
      default: return "Buscar en todos los campos...";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar />
      <main className="w-full p-4">
        <h1 className="text-4xl font-bold text-center mb-6">Licencias</h1>

        <div className="mb-4 px-4 max-w-5xl mx-auto flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-auto">
            <LicenseFilterCombobox 
              options={filterOptions}
              value={filterType}
              setValue={setFilterType}
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              defaultValue={search}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              disabled={!isAllLoaded}
            />
          </div>
        </div>

        {!isAllLoaded ? (
          <div className="flex flex-col items-center justify-center space-y-4 my-8">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-white text-xl">Cargando datos...</div>
          </div>
        ) : tableData.length === 0 ? (
          <div className="text-center text-gray-400 my-8">
            No se encontraron licencias que coincidan con tu búsqueda
          </div>
        ) : (
          <Suspense fallback={<div className="text-center my-4">Cargando tabla...</div>}>
            <div className="overflow-x-auto px-4">
              <VirtualizedList
                height={400}
                itemCount={tableData.length}
                itemSize={50}
                width="100%"
              >
                {({ index, style }) => {
                  const row = tableData[index];
                  return (
                    <div style={style} className="flex border-b border-gray-700">
                      {row.columns.map((col, colIndex) => (
                        <div key={colIndex} className="flex-1 px-4 py-2">
                          {col.value}
                        </div>
                      ))}
                    </div>
                  );
                }}
              </VirtualizedList>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-white">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </Suspense>
        )}
      </main>
    </div>
  );
};

export default Licenses;