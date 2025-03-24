import React, { useState, useEffect } from "react";
import { Mt4Licence, Mt4Client, Mt4Product } from "@/entities/entities/client.entity";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import ApiService from "@/services/CacheDecorator";

interface EditLicenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  license: Mt4Licence | null;
  clients: Mt4Client[];
  products: Mt4Product[];
  onLicenseUpdated: () => void;
}

export function EditLicenseDialog({
  isOpen,
  onClose,
  license,
  clients,
  products,
  onLicenseUpdated,
}: EditLicenseDialogProps) {
  const [editableLicense, setEditableLicense] = useState<Mt4Licence | null>(null);
  const [client, setClient] = useState<Mt4Client | null>(null);
  const [product, setProduct] = useState<Mt4Product | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Editable fields
  const [clientName, setClientName] = useState("");
  const [productName, setProductName] = useState("");

  // Reset state when dialog opens with new license
  useEffect(() => {
    if (license) {
      setEditableLicense({ ...license });
      setSelectedDate(license.expiration ? new Date(license.expiration) : undefined);
      
      const foundClient = clients.find(c => c.idClient === license.idClient) || null;
      setClient(foundClient);
      if (foundClient) {
        setClientName(foundClient.Nombre || "");
      }
      
      const foundProduct = products.find(p => p.idProduct === license.idProduct) || null;
      setProduct(foundProduct);
      if (foundProduct) {
        setProductName(foundProduct.Product || "");
      }
      
      setErrorMessage("");
    } else {
      setEditableLicense(null);
      setClient(null);
      setProduct(null);
      setSelectedDate(undefined);
      setClientName("");
      setProductName("");
    }
  }, [license, clients, products]);


  const handleSave = async () => {
    if (!editableLicense || !client || !product) return;
    
    try {
      setIsUpdating(true);
      setErrorMessage("");
      
      if (selectedDate) {
        editableLicense.expiration = selectedDate;
      }

      const updatedClient = { ...client, Nombre: clientName };
      const updatedProduct = { ...product, Product: productName };
      
      await ApiService.updateLicence(editableLicense);
      
      await ApiService.updateClient(updatedClient);
      await ApiService.updateProduct(updatedProduct);
      
      onLicenseUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating license:", error);
      setErrorMessage("Error al actualizar la licencia. Por favor, inténtalo de nuevo.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!editableLicense) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-lg bg-gray-800/30 text-white border border-gray-700/40 shadow-lg max-w-md mx-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Editar Licencia #{editableLicense.idLicence}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cliente</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/80 text-white rounded-md border border-gray-600/80 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 backdrop-blur-sm"
            />
          </div>
          
          {/* MT4 ID - No editable */}
          <div>
            <label className="block text-sm font-medium mb-1">MT4 ID</label>
            <input
              type="text"
              value={client?.MT4ID || "-"}
              disabled
              className="w-full px-3 py-2 bg-gray-700/70 text-white rounded-md border border-gray-600/70 opacity-75 backdrop-blur-sm"
            />
          </div>

      
          <div>
            <label className="block text-sm font-medium mb-1">Producto</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/80 text-white rounded-md border border-gray-600/80 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 backdrop-blur-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1">Fecha de Expiración</label>
            <DatePicker
              date={selectedDate}
              setDate={setSelectedDate}
              placeholder="Seleccionar fecha de expiración"
              className="bg-gray-800/80 border-gray-600/80 backdrop-blur-sm"
            />
            <p className="mt-1 text-xs text-gray-300">Haz clic para seleccionar una fecha</p>
          </div>
        </div>

        {errorMessage && (
          <div className="text-red-500 text-sm mt-2 bg-red-500/10 p-2 rounded-md backdrop-blur-sm">{errorMessage}</div>
        )}

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-700/70 text-white border-gray-600/70 hover:bg-gray-600/80 backdrop-blur-sm"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-blue-600/80 hover:bg-blue-700/90 text-white backdrop-blur-sm"
          >
            {isUpdating ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}