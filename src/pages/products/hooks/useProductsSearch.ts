import { useState } from "react";
import { Mt4Product } from "@/entities/entities/client.entity";
import useEventCallback from "@/hooks/useEventCallback";
import useSafeDispatch from "@/hooks/useSafeDispatch";

export function useProductsSearch(products: Mt4Product[]) {
  const [search, setSearch] = useState("");
  
  const safeSetSearch = useSafeDispatch(setSearch);

  const handleSearchChange = useEventCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    safeSetSearch(e.target.value);
  });

  const filteredProducts = products.filter((product) =>
    product.Product.toLowerCase().includes(search.toLowerCase())
  );

  return {
    search,
    handleSearchChange,
    filteredProducts
  };
}