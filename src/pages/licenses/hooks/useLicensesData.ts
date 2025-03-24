import { useState, useEffect, useMemo } from "react";
import ApiService from "@/services/CacheDecorator";
import useEventCallback from "@/hooks/useEventCallback";
import useSafeDispatch from "@/hooks/useSafeDispatch";
import { Mt4Client, Mt4Licence, Mt4Product } from "@/entities/entities/client.entity";

const useLicensesData = () => {
  const [licenses, setLicenses] = useState<Mt4Licence[]>([]);
  const [clients, setClients] = useState<Mt4Client[]>([]);
  const [products, setProducts] = useState<Mt4Product[]>([]);
  const [isLoading, setIsLoading] = useState({
    licenses: true,
    clients: true,
    products: true,
  });

  const safeSetLicenses = useSafeDispatch(setLicenses);
  const safeSetClients = useSafeDispatch(setClients);
  const safeSetProducts = useSafeDispatch(setProducts);
  const safeSetIsLoading = useSafeDispatch(setIsLoading);

  const fetchLicenses = useEventCallback(async (forceUpdate = false) => {
    try {
      safeSetIsLoading(prev => ({ ...prev, licenses: true }));
      // Invalidar caché si es una actualización forzada
      if (forceUpdate) {
        ApiService.invalidateCache("licenses");
      }
      const data = await ApiService.getLicenses();
      safeSetLicenses(data);
    } catch (error) {
      console.error("Error fetching licenses:", error);
    } finally {
      safeSetIsLoading(prev => ({ ...prev, licenses: false }));
    }
  });

  const fetchClients = useEventCallback(async (forceUpdate = false) => {
    try {
      safeSetIsLoading(prev => ({ ...prev, clients: true }));
      if (forceUpdate) {
        ApiService.invalidateCache("clients");
      }
      const data = await ApiService.getClients();
      safeSetClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      safeSetIsLoading(prev => ({ ...prev, clients: false }));
    }
  });

  const fetchProducts = useEventCallback(async (forceUpdate = false) => {
    try {
      safeSetIsLoading(prev => ({ ...prev, products: true }));
      if (forceUpdate) {
        ApiService.invalidateCache("products");
      }
      const data = await ApiService.getProducts();
      safeSetProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      safeSetIsLoading(prev => ({ ...prev, products: false }));
    }
  });

  // Carga inicial de datos
  useEffect(() => {
    fetchLicenses(false);
    fetchClients(false);
    fetchProducts(false);
  }, []);

  const isAllLoaded = useMemo(
    () => !isLoading.licenses && !isLoading.clients && !isLoading.products,
    [isLoading]
  );

  return {
    licenses,
    clients,
    products,
    isLoading,
    isAllLoaded,
    fetchLicenses,
    fetchClients,
    fetchProducts,
  };
};

export default useLicensesData;