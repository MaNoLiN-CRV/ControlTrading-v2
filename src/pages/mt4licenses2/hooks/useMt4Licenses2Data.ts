import { useState, useRef } from "react";
import { Mt4Licence2 } from "@/entities/entities/mt4licence2.entity";
import ApiService from "@/services/CacheDecorator";
import useEventCallback from "@/hooks/useEventCallback";
import useSafeDispatch from "@/hooks/useSafeDispatch";
import { tradingStationVersions, TradingStationVersion } from "@/pages/trading-station/TradingStationContainer";

interface UseMt4Licenses2DataOptions {
  defaultIdProduct?: number;
  version?: TradingStationVersion;
}

export function useMt4Licenses2Data(options: UseMt4Licenses2DataOptions = {}) {
  const [licenses, setLicenses] = useState<Mt4Licence2[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<Record<number, boolean>>({});
  
  const dataFetchedRef = useRef(false);

  const safeSetLicenses = useSafeDispatch(setLicenses);
  const safeSetIsLoading = useSafeDispatch(setIsLoading);
  const safeSetIsUpdating = useSafeDispatch(setIsUpdating);

  const defaultIdProduct = options.version 
    ? tradingStationVersions[options.version].idProduct 
    : options.defaultIdProduct || 177; 

  const fetchLicenses = useEventCallback(async () => {
    if (dataFetchedRef.current && licenses.length > 0) return;
    
    safeSetIsLoading(true);
    try {
      const data = await ApiService.getMt4Licenses2();
      safeSetLicenses(data);
      dataFetchedRef.current = true;
    } catch (error) {
      console.error("Error fetching mt4 licenses:", error);
      dataFetchedRef.current = false;
    } finally {
      safeSetIsLoading(false);
    }
  });

  const updateLicense = useEventCallback(async (id: number, mt4id: string) => {
    if (!id) return;

    safeSetIsUpdating((prev) => ({ ...prev, [id]: true }));

    try {
      const licenseToUpdate = licenses.find((lic) => lic.idLicence === id);
      if (!licenseToUpdate) return;

      // Optimistic update
      safeSetLicenses((prevLicenses) =>
        prevLicenses.map((lic) =>
          lic.idLicence === id ? { ...lic, MT4ID: mt4id } : lic
        )
      );

      await ApiService.updateMt4License2(id, mt4id);
    } catch (error) {
      console.error("Error updating license:", error);
      
      // Rollback on error
      safeSetLicenses((prevLicenses) => [...prevLicenses]);
    } finally {
      safeSetIsUpdating((prev) => ({ ...prev, [id]: false }));
    }
  });

  const addLicense = useEventCallback(async (licenseData: Omit<Mt4Licence2, 'idLicence'>) => {
    try {
      // If idProduct is not provided, use the default
      const dataToSend = {
        ...licenseData,
        idProduct: licenseData.idProduct || defaultIdProduct
      };

      const newLicense = await ApiService.createMt4License2(dataToSend);
      safeSetLicenses((prev) => [...prev, newLicense]);
      return newLicense;
    } catch (error) {
      console.error("Error creating license:", error);
      throw error;
    }
  });

  const deleteLicense = useEventCallback(async (id: number) => {
    if (!id) return;

    safeSetIsUpdating((prev) => ({ ...prev, [id]: true }));

    try {
      // Optimistic delete
      safeSetLicenses((prevLicenses) =>
        prevLicenses.filter((lic) => lic.idLicence !== id)
      );

      await ApiService.deleteMt4License2(id);
    } catch (error) {
      console.error("Error deleting license:", error);
      
      // Rollback on error
      fetchLicenses();
    } finally {
      safeSetIsUpdating((prev) => ({ ...prev, [id]: false }));
    }
  });

  return {
    licenses,
    isLoading,
    isUpdating,
    fetchLicenses,
    updateLicense,
    addLicense,
    deleteLicense,
    defaultIdProduct
  };
}