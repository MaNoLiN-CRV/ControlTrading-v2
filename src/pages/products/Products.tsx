import { useEffect, useState } from "react";
import { useAuthContext } from "../login/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useProductsData } from "./hooks/useProductsData";
import useSearchAndPagination from "@/hooks/useSearchAndPagination";
import { Search, Pencil } from "lucide-react"; // Add icon imports
import { EditLinkDialog } from "./components/EditLinkDialog";
import { Mt4Product } from "@/entities/entities/mt4product.entity";

const Products = () => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  
  const { 
    products, 
    isLoading, 
    isUpdating, 
    fetchProducts, 
    updateProductDemoDays,
    updateProductLink
  } = useProductsData();
  
  const filterProducts = (product: any, searchText: string) => {
    const searchLower = searchText.toLowerCase();
    return (
      product.Product.toLowerCase().includes(searchLower) ||
      product.version.toString().includes(searchLower) ||
      product.DemoDays.toString().includes(searchLower)
    );
  };

  const {
    search,
    currentPage,
    totalPages,
    paginatedItems: paginatedProducts,
    handleSearchChange,
    setCurrentPage,
    filteredItemsCount
  } = useSearchAndPagination(products, 10, undefined, filterProducts);

  const handleUpdateProductDemoDays = (id: number, value: string) => {
    if (id === undefined) return;
    updateProductDemoDays(id, value);
  };

  const [selectedProduct, setSelectedProduct] = useState<Mt4Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditLink = (product: Mt4Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleLinkUpdated = async (id: number, newLink: string) => {
    await updateProductLink(id, newLink);
  };

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
        
        {/* Search input with stats */}
        <div className="mb-4 px-4 max-w-5xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, versión o días de demo..."
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/70 text-white rounded-lg border border-gray-700 
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition backdrop-blur-sm
                placeholder:text-gray-400"
            />
          </div>
          {search && (
            <div className="mt-2 text-sm text-gray-400">
              Encontrados: {filteredItemsCount} productos
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center my-8">
            <div className="text-white text-xl">Cargando productos...</div>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center text-gray-400 my-8">
            No se encontraron productos que coincidan con la búsqueda
          </div>
        ) : (
          <>
            <div className="overflow-x-auto px-4">
              <table className="min-w-full bg-gray-800/70 backdrop-blur-md rounded-lg shadow-xl border border-gray-700/50 table-fixed">
                <thead>
                  <tr>
                    <th className="px-4 py-2 w-[35%]">Producto</th>
                    <th className="px-4 py-2 w-[15%]">Versión</th>
                    <th className="px-4 py-2 w-[25%]">Días Demo</th>
                    <th className="px-4 py-2 w-[25%]">Descargar</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr key={product.idProduct} className="hover:bg-gray-700/50">
                      <td className="border border-gray-700/40 px-4 py-2 truncate">{product.Product}</td>
                      <td className="border border-gray-700/40 px-4 py-2 truncate">{product.version}</td>
                      <td className="border border-gray-700/40 px-4 py-2">
                        <div className="relative">
                          <input
                            type="text"
                            value={product.DemoDays}
                            onChange={(e) => 
                              product.idProduct !== undefined && 
                              handleUpdateProductDemoDays(product.idProduct, e.target.value)
                            }
                            className={`w-full px-2 py-1 bg-gray-700/80 text-white rounded-lg border border-gray-600/80 focus:outline-none focus:ring-2 focus:ring-blue-500/70 backdrop-blur-sm transition ${
                              product.idProduct !== undefined && isUpdating[product.idProduct] ? 'opacity-50' : ''
                            }`}
                            disabled={product.idProduct !== undefined && isUpdating[product.idProduct]}
                          />
                          {product.idProduct !== undefined && isUpdating[product.idProduct] && (
                            <div className="absolute inset-y-0 right-2 flex items-center">
                              <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-700/40 px-4 py-2 text-center">
                        <div className="flex items-center justify-between px-2">
                          <a
                            href={product.link}
                            className="text-blue-500 hover:text-blue-300 transition flex-1"
                            download
                          >
                            Descargar EX4
                          </a>
                          <button
                            onClick={() => handleEditLink(product)}
                            className="p-1 text-blue-400 hover:text-blue-300 rounded focus:outline-none"
                            title="Editar enlace"
                          >
                            <Pencil size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 px-4 max-w-5xl mx-auto">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
              >
                Anterior
              </button>
              <span className="text-white">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </main>
      <EditLinkDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onLinkUpdated={handleLinkUpdated}
      />
    </div>
  );
};

export default Products;