import { useState, useRef } from "react";
import { Mt4Product } from "@/entities/entities/client.entity";
import ApiService from "@/services/CacheDecorator";
import useEventCallback from "@/hooks/useEventCallback";
import useSafeDispatch from "@/hooks/useSafeDispatch";

export function useProductsData() {
  const [products, setProducts] = useState<Mt4Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<Record<number, boolean>>({});
  
  const dataFetchedRef = useRef(false);

  const safeSetProducts = useSafeDispatch(setProducts);
  const safeSetIsLoading = useSafeDispatch(setIsLoading);
  const safeSetIsUpdating = useSafeDispatch(setIsUpdating);

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

  const updateProductDemoDays = useEventCallback(async (id: number, value: string) => {
    let product = products.find((product) => product.idProduct === id);
    if (!product) return;

    if (value === "") {
      safeSetProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.idProduct === id ? { ...p, DemoDays: "" } : p
        )
      );
      return;
    }

    const numValue = parseInt(value) || 0;

    safeSetIsUpdating((prev) => ({ ...prev, [id]: true }));

    try {
      // Optimistic update
      safeSetProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.idProduct === id ? { ...p, DemoDays: numValue } : p
        )
      );

      await ApiService.updateProductDemoDays(id, numValue);
    } catch (error) {
      console.error("Error updating product demo days:", error);

      // Rollback on error
      safeSetProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.idProduct === id ? { ...p, DemoDays: product?.DemoDays || 0 } : p
        )
      );
    } finally {
      safeSetIsUpdating((prev) => ({ ...prev, [id]: false }));
    }
  });

  return {
    products,
    isLoading,
    isUpdating,
    fetchProducts,
    updateProductDemoDays
  };
}