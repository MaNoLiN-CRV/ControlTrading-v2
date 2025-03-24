import { useState, useRef } from "react";
import { Mt4Product } from "@/entities/entities/client.entity";
import ApiService from "@/services/CacheDecorator";
import useEventCallback from "@/hooks/useEventCallback";
import useSafeDispatch from "@/hooks/useSafeDispatch";

export function useProductsData() {
  const [products, setProducts] = useState<Mt4Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const dataFetchedRef = useRef(false);

  const safeSetProducts = useSafeDispatch(setProducts);
  const safeSetIsLoading = useSafeDispatch(setIsLoading);

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

  const updateProductDemoDays = useEventCallback((id: number, value: string) => {
    safeSetProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.idProduct === id ? { ...product, DemoDays: parseInt(value) || 0 } : product
      )
    );
    // TODO: Implement debounced API update instead of on every change
  });

  return {
    products,
    isLoading,
    fetchProducts,
    updateProductDemoDays
  };
}