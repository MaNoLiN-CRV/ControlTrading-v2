import { useState, useMemo } from "react";
import useEventCallback from "@/hooks/useEventCallback";

const useSearchAndPagination = (
  items: any[],
  itemsPerPage: number,
  sortFn?: (a: any, b: any) => number
) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchChange = useEventCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  });

  const filteredItems = useMemo(() => {
    let filtered = items.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
    if (sortFn) {
      filtered = [...filtered].sort(sortFn); // Apply sort function if provided
    }
    return filtered;
  }, [items, search, sortFn]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return {
    search,
    currentPage,
    totalPages,
    paginatedItems,
    handleSearchChange,
    setCurrentPage,
  };
};

export default useSearchAndPagination;