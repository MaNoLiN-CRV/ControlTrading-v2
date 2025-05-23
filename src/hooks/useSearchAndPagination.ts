import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import useSafeDispatch from "@/hooks/useSafeDispatch";

/**
 * Custom hook for handling search, pagination, filtering and sorting
 * @param items Array of items to search, filter, sort and paginate
 * @param itemsPerPage Number of items per page
 * @param sortFn Optional function to sort items
 * @param filterFn Optional function to filter items
 * @param paginationKey Optional key to maintain separate pagination states for different views
 * @returns search, currentPage, totalPages, paginatedItems, handleSearchChange, setCurrentPage, filteredItemsCount
 */
const useSearchAndPagination = (
  items: any[],
  itemsPerPage: number,
  sortFn?: (a: any, b: any) => number,
  filterFn?: (item: any, searchText: string) => boolean,
  paginationKey?: string
) => {
  // Use refs for intermediate state to avoid re-renders
  const searchInputRef = useRef("");
  const [search, setSearch] = useState("");
  
  // Use paginationKey to create separate pagination states
  const stateKey = paginationKey || 'default';
  const [paginationStates, setPaginationStates] = useState<Record<string, number>>({
    [stateKey]: 1
  });
  
  const currentPage = paginationStates[stateKey] || 1;
  
  const safeSetSearch = useSafeDispatch(setSearch);
  const safeSetPaginationStates = useSafeDispatch(setPaginationStates);

  // Set current page while maintaining separate states for different keys
  const setCurrentPage = useCallback((pageUpdater: number | ((prev: number) => number)) => {
    safeSetPaginationStates(prev => {
      const currentPageValue = prev[stateKey] || 1;
      const newPageValue = typeof pageUpdater === 'function' 
        ? pageUpdater(currentPageValue) 
        : pageUpdater;
      
      return {
        ...prev,
        [stateKey]: newPageValue
      };
    });
  }, [safeSetPaginationStates, stateKey]);

  // Debounce timer reference
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized search handler that doesn't trigger re-renders during typing
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Update the ref immediately for a responsive feel
    searchInputRef.current = value;
    
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a new timer
    debounceTimerRef.current = setTimeout(() => {
      safeSetSearch(value);
      setCurrentPage(1); // Reset to first page when search changes
    }, 300);
  }, [safeSetSearch, setCurrentPage]);

  // Clean up the timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Filtered items - only recalculated when search or items change
  const filteredItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    
    let filtered;
    
    // Apply filtering logic
    if (filterFn && search) {
      filtered = items.filter(item => filterFn(item, search));
    } else if (search) {
      filtered = items.filter(item => {
        // Optimize default filter to avoid excessive string operations
        for (const key in item) {
          const value = item[key];
          if (value && String(value).toLowerCase().includes(search.toLowerCase())) {
            return true;
          }
        }
        return false;
      });
    } else {
      filtered = items;
    }
    
    // Apply sorting if provided
    if (sortFn) {
      return [...filtered].sort(sortFn);
    }
    
    return filtered;
  }, [items, search, sortFn, filterFn]);

  // Paginated items - only recalculated when filtered items or page changes
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  // Total pages calculation
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));

  // Ensure current page is valid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage, setCurrentPage]);

  return {
    search,
    currentPage,
    totalPages,
    paginatedItems,
    handleSearchChange,
    setCurrentPage,
    filteredItemsCount: filteredItems.length,
    inputValue: searchInputRef.current
  };
};

export default useSearchAndPagination;