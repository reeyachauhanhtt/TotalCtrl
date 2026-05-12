import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import InventoryMainSection from '../components/inventory/InventoryMainSection';
import InventoryTable from '../components/inventory/InventoryTable';
import { fetchProducts } from '../services/productService';
import AddItemModal from '../components/Inventory/AddItemModal';
import TransferItemModal from '../components/Inventory/TransferItemModal';
import {
  InventoryPageSkeleton,
  TableRowSkeleton,
} from '../components/Common/Skeleton';
import { fetchMeasurementUnits } from '../services/masterDataService';

export default function InventoryPage({ onTransferSuccess }) {
  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);

  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [stockFilter, setStockFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showTransfer, setShowTransfer] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (!selectedInventory?.id) return;
    setInventoryLoading(true);
    const timer = setTimeout(() => setInventoryLoading(false), 300);
    return () => clearTimeout(timer);
  }, [selectedInventory?.id]);

  useEffect(() => {
    if (!selectedInventory?.id) return;
    setSelectedSupplier(null);
    setStockFilter('all');
    setSearchQuery('');
    setDebouncedSearch('');
    setHeaderScrolled(false);
  }, [selectedInventory?.id]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(() => setDebouncedSearch(value), 300);
  };

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products', selectedInventory?.id, selectedSupplier?.Id ?? null],
    queryFn: ({ pageParam = 0 }) =>
      fetchProducts({
        inventoryId: selectedInventory.id,
        supplierIds: selectedSupplier?.Id,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 20) return undefined;
      return allPages.length * 20;
    },
    enabled: !!selectedInventory?.id,
    staleTime: 1000 * 60 * 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const rawProducts = data?.pages?.flat() || [];

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setHeaderScrolled(el.scrollTop > 500);

    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 100) {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    }
  };

  const products = rawProducts
    .map((item, index) => ({
      id: `${item.id}_${index}`,
      rawId: item.id,
      stockTakingUnitId: item.stockTakingUnitId,
      name: item.productName,
      arrivalInfo: item.arrivalDate || '----',
      expirationInfo: item.expirationDate || '----',
      quantity: item.totalQuantity,
      unit: item.stockTakingUnitPlural || '',
      unitPrice: item.pricePerStockTakingUnit,
      total: item.totalPrice,
      batches: (item.products || []).map((b, batchIndex) => ({
        id: `${b.storeProductId}_${index}_${batchIndex}`,
        rawId: b.storeProductId,
        expiryDateId: b.storeProuductExpiryDateId,
        storeProductId: b.storeProductId,
        expirationDate: b.expirationDate || null,
        arrivalDate: b.arrivalDate || '----',
        daysInStorage: b.storageInDays ?? '---',
        quantity: b.quantity ?? 0,
        unit: item.stockTakingUnitPlural || '',
        unitPrice: item.pricePerStockTakingUnit,
        total: b.subTotalPrice ?? 0,
        isManual: b.isManual ?? 0,
        stockCountItemId: b.stockCountItemId ?? null,
        daysLeft: b.daysLeft ?? 0,
      })),
    }))
    .sort((a, b) => {
      const aOut = Number(a.quantity ?? 0) === 0;
      const bOut = Number(b.quantity ?? 0) === 0;
      if (aOut === bOut) return 0;
      return aOut ? 1 : -1;
    });

  const { data: unitData } = useQuery({
    queryKey: ['measurementUnits'],
    queryFn: fetchMeasurementUnits,
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const units =
    unitData?.purchaseUnit?.length > 0
      ? unitData.purchaseUnit.map((u) => ({
          label: u.name,
          value: u.name,
          id: u.id,
        }))
      : [];

  const LOW_STOCK_THRESHOLD = 10;

  const filteredProducts = products.filter((item) => {
    const qty = Number(item.quantity ?? 0);
    const matchesStock =
      stockFilter === 'out'
        ? qty === 0
        : stockFilter === 'low'
          ? qty > 0 && qty <= LOW_STOCK_THRESHOLD
          : stockFilter === 'in'
            ? qty >= LOW_STOCK_THRESHOLD
            : true;

    const matchesSearch =
      debouncedSearch.trim() === '' ||
      item.name.toLowerCase().includes(debouncedSearch.toLowerCase());

    return matchesStock && matchesSearch;
  });

  if (!selectedInventory || isLoading || inventoryLoading) {
    return <InventoryPageSkeleton />;
  }

  return (
    <div className='h-full flex flex-col overflow-hidden'>
      <TransferItemModal
        open={showTransfer}
        onClose={() => setShowTransfer(false)}
        selectedInventory={selectedInventory}
        onTransferSuccess={onTransferSuccess}
      />

      {/* STICKY HEADER — outside scroll container, never moves */}
      <InventoryMainSection
        setShowModal={setShowModal}
        products={products}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        setShowTransfer={setShowTransfer}
        isProductsFetching={isFetching}
        selectedSupplier={selectedSupplier}
        setSelectedSupplier={setSelectedSupplier}
        headerScrolled={headerScrolled}
      />

      {/* SCROLL CONTAINER — only table scrolls */}
      <div
        className='flex-1 min-h-0 overflow-y-auto bg-white shadow-sm'
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {isFetching && rawProducts.length === 0 ? (
          <InventoryPageSkeleton />
        ) : filteredProducts.length === 0 ? (
          <p className='p-10 text-center text-gray-400 text-sm'>
            No results found
          </p>
        ) : (
          <>
            <InventoryTable
              data={filteredProducts}
              stockFilter={stockFilter}
              debouncedSearch={debouncedSearch}
            />
            {isFetchingNextPage && (
              <div className='p-4'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <TableRowSkeleton key={i} asTr={false} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <AddItemModal
        open={showModal}
        onClose={() => setShowModal(false)}
        selectedInventory={selectedInventory}
        units={units}
      />
    </div>
  );
}
