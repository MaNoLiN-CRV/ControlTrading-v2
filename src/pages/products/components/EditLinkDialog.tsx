import { Mt4Product } from "@/entities/entities/client.entity";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface EditLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Mt4Product | null;
  onLinkUpdated: (id: number, newLink: string) => Promise<void>;
}

export function EditLinkDialog({
  isOpen,
  onClose,
  product,
  onLinkUpdated,
}: EditLinkDialogProps) {
  const [link, setLink] = useState(product?.link || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!product?.idProduct) return;
    
    setIsUpdating(true);
    setError("");
    
    try {
      await onLinkUpdated(product.idProduct, link);
      onClose();
    } catch (err) {
      setError("Error al actualizar el enlace");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-lg bg-gray-800/30 text-white border border-gray-700/40 shadow-lg max-w-md mx-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Editar Enlace EX4
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div>
            <label className="block text-sm font-medium mb-1">Producto</label>
            <input
              type="text"
              value={product?.Product || ""}
              disabled
              className="w-full px-3 py-2 bg-gray-700/50 text-white rounded-md border border-gray-600/50 opacity-75"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Enlace EX4</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/80 text-white rounded-md border border-gray-600/80 
                focus:outline-none focus:ring-2 focus:ring-blue-500/70 backdrop-blur-sm"
              placeholder={product?.link}
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2 bg-red-500/10 p-2 rounded-md">
            {error}
          </div>
        )}

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-700/70 text-white border-gray-600/70 hover:bg-gray-600/80"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-blue-600/80 hover:bg-blue-700/90 text-white"
          >
            {isUpdating ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}