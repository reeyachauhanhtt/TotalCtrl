import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProducts } from '../services/productService';

const PAGE_SIZE = 20;
const SCROLL_THRESHOLD_PX = 150;
const SEARCH_DEBOUNCE_MS = 400;

export function useProductPicker(
  inventoryId,
  { enabled = true, isInStock = '1,2', searchQuery = '', onSearchChange } = {},
) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const searchRef = useRef(null);

  const {
    data: productsData,
    isFetching: loadingProducts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products', inventoryId],
    queryFn: ({ pageParam = 0 }) =>
      fetchProducts({
        inventoryId,
        offset: pageParam,
        limit: PAGE_SIZE,
        isInStock,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === PAGE_SIZE) return allPages.length * PAGE_SIZE;
      return undefined;
    },
    enabled: enabled && !!inventoryId,
    staleTime: 0,
  });

  const products = productsData?.pages?.flat() ?? [];
  const filteredProducts = products.filter((p) =>
    p.productName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange?.(searchInputValue);
      setIsDebouncing(false);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInputValue]);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
        setSearchDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleScroll(e) {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD_PX &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }

  function handleSearchInputChange(value) {
    setSearchInputValue(value);
    setIsDebouncing(true);
    setSearchDropdownOpen(true);
  }

  function resetSearch() {
    setSearchInputValue('');
    setSearchDropdownOpen(false);
    setSearchFocused(false);
    setIsDebouncing(false);
  }

  return {
    products,
    filteredProducts,
    loadingProducts,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    handleScroll,
    searchFocused,
    setSearchFocused,
    searchInputValue,
    handleSearchInputChange,
    searchDropdownOpen,
    setSearchDropdownOpen,
    isDebouncing,
    searchRef,
    resetSearch,
  };
}
