import { useState, useEffect, useRef, useMemo } from "react";
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

  const dataFetchedRef = useRef({
    licenses: false,
    clients: false,
    products: false,
  });

  const safeSetLicenses = useSafeDispatch(setLicenses);
  const safeSetClients = useSafeDispatch(setClients);
  const safeSetProducts = useSafeDispatch(setProducts);
  const safeSetIsLoading = useSafeDispatch(setIsLoading);

  const fetchLicenses = useEventCallback(async () => {
    if (dataFetchedRef.current.licenses && licenses.length > 0) return;
    try {
      const data = await ApiService.getLicenses();
      safeSetLicenses(data);
      dataFetchedRef.current.licenses = true;
    } catch (error) {
      console.error("Error fetching licenses:", error);
    } finally {
      safeSetIsLoading((prev) => ({ ...prev, licenses: false }));
    }
  });

  const fetchClients = useEventCallback(async () => {
    if (dataFetchedRef.current.clients && clients.length > 0) return;
    try {
      const data = await ApiService.getClients();
      safeSetClients(data);
      dataFetchedRef.current.clients = true;
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      safeSetIsLoading((prev) => ({ ...prev, clients: false }));
    }
  });

  const fetchProducts = useEventCallback(async () => {
    if (dataFetchedRef.current.products && products.length > 0) return;
    try {
      const data = await ApiService.getProducts();
      safeSetProducts(data);
      dataFetchedRef.current.products = true;
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      safeSetIsLoading((prev) => ({ ...prev, products: false }));
    }
  });

  useEffect(() => {
    if (!dataFetchedRef.current.licenses) fetchLicenses();
    if (!dataFetchedRef.current.clients) fetchClients();
    if (!dataFetchedRef.current.products) fetchProducts();
  }, [fetchLicenses, fetchClients, fetchProducts]);

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