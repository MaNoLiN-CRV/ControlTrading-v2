import { useState, useRef } from "react";
import { Mt4Licence2 } from "@/entities/entities/mt4licence2.entity";
import ApiService from "@/services/CacheDecorator";
import useEventCallback from "@/hooks/useEventCallback";
import useSafeDispatch from "@/hooks/useSafeDispatch";

export function useMt4Licenses2Data() {
  const [licenses, setLicenses] = useState<Mt4Licence2[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<Record<number, boolean>>({});
  
  const dataFetchedRef = useRef(false);

  const safeSetLicenses = useSafeDispatch(setLicenses);
  const safeSetIsLoading = useSafeDispatch(setIsLoading);
  const safeSetIsUpdating = useSafeDispatch(setIsUpdating);

  const fetchLicenses = useEventCallback(async () => {
    if (dataFetchedRef.current && licenses.length > 0) return;
    
    safeSetIsLoading(true);
    try {
      const data = await ApiService.getMt4Licenses2();
      if (!data) return;  
      safeSetLicenses(data);
      dataFetchedRef.current = true;
    } catch (error) {
      console.error("Error fetching MT4 licenses:", error);
      dataFetchedRef.current = false;
    } finally {
      safeSetIsLoading(false);
    }
  });

  const updateLicense = useEventCallback(async (id: number, mt4id: string) => {
    safeSetIsUpdating((prev) => ({ ...prev, [id]: true }));

    try {
      const updatedLicense = await ApiService.updateMt4License2(id, mt4id);
      safeSetLicenses((prevLicenses) =>
        prevLicenses.map((license) =>
          license.idLicence === id ? { ...license, MT4ID: mt4id } : license
        )
      );
      return updatedLicense;
    } catch (error) {
      console.error("Error updating license:", error);
      throw error;
    } finally {
      safeSetIsUpdating((prev) => ({ ...prev, [id]: false }));
    }
  });

  const addLicense = useEventCallback(async () => {
    try {
      const newLicense = await ApiService.createMt4License2({
        MT4ID: "000000",
        idProduct: 1, // Default product ID
        idShop: 1 // Default shop ID
      });
      safeSetLicenses((prev) => [...prev, newLicense]);
      return newLicense;
    } catch (error) {
      console.error("Error creating license:", error);
      throw error;
    }
  });

  const deleteLicense = useEventCallback(async (id: number) => {
    try {
      await ApiService.deleteMt4License2(id);
      safeSetLicenses((prev) => prev.filter(license => license.idLicence !== id));
    } catch (error) {
      console.error("Error deleting license:", error);
      throw error;
    }
  });

  return {
    licenses,
    isLoading,
    isUpdating,
    fetchLicenses,
    updateLicense,
    addLicense,
    deleteLicense
  };
}