import { useEffect, useState } from "react";
import { Plus, Minus, Trash2, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useMt4Licenses2Data } from "./hooks/useMt4Licenses2Data";
import useSearchAndPagination from "@/hooks/useSearchAndPagination";
import { Button } from "@/components/ui/button";
import type { TradingStationVersion } from "@/pages/trading-station/TradingStationContainer";

interface Mt4Licenses2Props {
  idProduct?: number;
  version?: TradingStationVersion;
}

const Mt4Licenses2 = ({ idProduct, version }: Mt4Licenses2Props) => {
  
  const { 
    licenses, 
    isLoading, 
    isUpdating, 
    fetchLicenses, 
    updateLicense, 
    addLicense,
    deleteLicense,
    defaultIdProduct
  } = useMt4Licenses2Data({ defaultIdProduct: idProduct, version });

  // Usar el idProduct proporcionado o el predeterminado del hook
  const productId = idProduct || defaultIdProduct;
  
  // Filtrar licencias por idProduct
  const filteredByProduct = licenses.filter(license => license.idProduct === productId);
  
  const filterLicenses = (license: any, searchText: string) => {
    const searchLower = searchText.toLowerCase();
    return (
      license.MT4ID.toLowerCase().includes(searchLower) ||
      license.idLicence.toString().includes(searchLower)
    );
  };
  
  const {
    search,
    currentPage,
    totalPages,
    paginatedItems: paginatedLicenses,
    handleSearchChange,
    setCurrentPage,
    filteredItemsCount
  } = useSearchAndPagination(filteredByProduct, 10, undefined, filterLicenses);

  const [licenseCount, setLicenseCount] = useState(1);

  const handleUpdateMt4ID = async (id: number, value: string) => {
    if (!id) return;
    try {
      await updateLicense(id, value);
    } catch (error) {
      console.error("Error updating MT4ID:", error);
    }
  };

  const handleAddLicenses = async () => {
    try {
      const promises = Array(licenseCount)
        .fill(null)
        .map(() => 
          addLicense({
            MT4ID: "000000",
            idProduct: productId,
            idShop: 1
          })
        );
      await Promise.all(promises);
    } catch (error) {
      console.error("Error adding licenses:", error);
    }
  };

  const handleDeleteLicense = async (id: number) => {
    try {
      await deleteLicense(id);
    } catch (error) {
      console.error("Error deleting license:", error);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  // Componente para el contador de licencias a agregar
  const AddLicenseControl = () => (
    <div className="flex items-center space-x-4">
      <div className="flex items-center bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-700/50">
        <button
          onClick={() => setLicenseCount(Math.max(1, licenseCount - 1))}
          className="p-2 text-gray-400 hover:text-white"
          aria-label="Decrease count"
        >
          <Minus size={16} />
        </button>
        <span className="w-12 text-center">{licenseCount}</span>
        <button
          onClick={() => setLicenseCount(licenseCount + 1)}
          className="p-2 text-gray-400 hover:text-white"
          aria-label="Increase count"
        >
          <Plus size={16} />
        </button>
      </div>
      <Button
        onClick={handleAddLicenses}
        className="bg-blue-600/80 hover:bg-blue-700/90 text-white backdrop-blur-sm"
      >
        Agregar Licencias
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar />
      <main className="w-full px-6 sm:px-8 md:px-12 py-6 mx-auto max-w-7xl pt-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">
              Trading Station {version}
            </h1>
            <AddLicenseControl />
          </div>

          {/* Search input with stats */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por MT4 ID o número de licencia..."
                onChange={handleSearchChange}
                className="w-full px-4 py-2 bg-gray-800/70 text-white rounded-lg border border-gray-700 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 transition backdrop-blur-sm
                  placeholder:text-gray-400"
              />
            </div>
            {search && (
              <div className="mt-2 text-sm text-gray-400">
                Encontradas: {filteredItemsCount} licencias
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center my-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : paginatedLicenses.length === 0 ? (
            <div className="text-center text-gray-400 my-8">
              No se encontraron licencias que coincidan con la búsqueda
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800/70 backdrop-blur-md rounded-lg shadow-xl border border-gray-700/50">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">MT4 ID</th>
                      <th className="px-4 py-2 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLicenses.map((license) => (
                      <tr key={license.idLicence} className="border-t border-gray-700/40">
                        <td className="px-4 py-2">{license.idLicence}</td>
                        <td className="px-4 py-2">
                          <div className="relative">
                            <input
                              type="text"
                              value={license.MT4ID}
                              onChange={(e) => handleUpdateMt4ID(license.idLicence!, e.target.value)}
                              className={`w-full px-3 py-1.5 bg-gray-700/50 text-white rounded-md border border-gray-600/50 
                                focus:outline-none focus:ring-2 focus:ring-blue-500/70 transition ${
                                isUpdating[license.idLicence!] ? 'opacity-50' : ''
                              }`}
                              disabled={isUpdating[license.idLicence!]}
                            />
                            {isUpdating[license.idLicence!] && (
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <Button
                            variant="ghost"
                            onClick={() => handleDeleteLicense(license.idLicence!)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                >
                  Anterior
                </Button>
                <span className="text-gray-300">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                >
                  Siguiente
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Mt4Licenses2;