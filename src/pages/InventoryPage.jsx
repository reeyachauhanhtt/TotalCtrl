import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import InventoryMainSection from '../components/Inventory/InventoryMainSection';
import InventoryTable from '../components/Inventory/InventoryTable';
import { fetchProducts } from '../services/productService';
import { fetchStockValue, fetchInventory } from '../services/inventoryService';
import AddItemModal from '../components/Inventory/AddItemModal';
import TransferItemModal from '../components/Inventory/TransferItemModal';
import {
  InventoryPageSkeleton,
  TableRowSkeleton,
} from '../components/Common/Skeleton';
import { fetchMeasurementUnits } from '../services/masterDataService';
import { setSelectedInventory } from '../store/inventorySlice';

export default function InventoryPage({ onTransferSuccess }) {
  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);

  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [stockFilter, setStockFilter] = useState('in'); // was 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showTransfer, setShowTransfer] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const location = useLocation();

  const scrollRef = useRef(null);
  const dispatch = useDispatch();

  const { data: inventoryData } = useQuery({
    queryKey: ['inventories'],
    queryFn: fetchInventory,
    staleTime: Infinity,
  });

  // Handle URL params: ?id=inventoryId&productName=product
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const inventoryId = params.get('id');
    const productName = params.get('productName');

    if (productName) {
      setSearchQuery(productName);
      setDebouncedSearch(productName);
    }

    if (inventoryId && inventoryData) {
      const list = inventoryData?.Data || inventoryData?.data || [];
      const match = list.find((inv) => inv.id === inventoryId);
      if (match) dispatch(setSelectedInventory(match));
    }
  }, [location.search, inventoryData]);

  // Show skeleton on inventory switch
  useEffect(() => {
    if (!selectedInventory?.id) return;
    setShowSkeleton(true);
    const t = setTimeout(() => setShowSkeleton(false), 600);
    return () => clearTimeout(t);
  }, [selectedInventory?.id]);

  // Reset filters on inventory switch — but preserve search if coming from URL
  useEffect(() => {
    if (!selectedInventory?.id) return;
    const params = new URLSearchParams(location.search);
    const productName = params.get('productName');
    setSelectedSupplier(null);
    setStockFilter('all');
    if (!productName) {
      setSearchQuery('');
      setDebouncedSearch('');
    }
    setHeaderScrolled(false);
  }, [selectedInventory?.id]);

  const { data: stockData, isLoading: isStockLoading } = useQuery({
    queryKey: ['stock-value', selectedInventory?.id],
    queryFn: () => fetchStockValue(selectedInventory.id),
    enabled: !!selectedInventory?.id,
    staleTime: 1000 * 60 * 2,
    refetchOnMount: false,
  });

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      'products',
      selectedInventory?.id,
      selectedSupplier?.Id ?? null,
      stockFilter,
    ],
    queryFn: ({ pageParam = 0 }) =>
      fetchProducts({
        inventoryId: selectedInventory.id,
        supplierIds: selectedSupplier?.Id,
        offset: pageParam,
        isInStock:
          stockFilter === 'out'
            ? '0'
            : stockFilter === 'in'
              ? '1'
              : stockFilter === 'low'
                ? '2'
                : '0,1,2',
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
  console.log(rawProducts[0]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setHeaderScrolled(el.scrollTop > 500);

    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 100) {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    }
  };

  const products = rawProducts.map((item, index) => ({
    id: `${item.id}_${index}`,
    rawId: item.id,
    stockTakingUnitId: item.stockTakingUnitId,
    name: item.productName,
    arrivalInfo: item.arrivalDate || '----',
    expirationInfo: item.expirationDate || '----',
    quantity: item.totalQuantity,
    unit:
      item.totalQuantity === 1
        ? item.stockTakingUnit || item.stockTakingUnitPlural || ''
        : item.stockTakingUnitPlural || '',
    unitSingular: item.stockTakingUnit || item.stockTakingUnitPlural || '',
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
      unit:
        b.quantity === 1
          ? item.stockTakingUnit || item.stockTakingUnitPlural || ''
          : item.stockTakingUnitPlural || '',
      unitSingular: item.stockTakingUnit || item.stockTakingUnitPlural || '',
      unitPrice: item.pricePerStockTakingUnit,
      total: b.subTotalPrice ?? 0,
      isManual: b.isManual ?? 0,
      stockCountItemId: b.stockCountItemId ?? null,
      daysLeft: b.daysLeft ?? 0,
    })),
  }));

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

    const matchesSearch =
      debouncedSearch.trim() === '' ||
      item.name.toLowerCase().includes(debouncedSearch.toLowerCase());

    // return matchesStock && matchesSearch;
    return matchesSearch;
  });

  if (!selectedInventory || isLoading || isStockLoading || showSkeleton) {
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

      <InventoryMainSection
        setShowModal={setShowModal}
        products={products}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setDebouncedSearch={setDebouncedSearch}
        setShowTransfer={setShowTransfer}
        isProductsFetching={isFetching}
        selectedSupplier={selectedSupplier}
        setSelectedSupplier={setSelectedSupplier}
        headerScrolled={headerScrolled}
        stockData={stockData}
        filteredCount={filteredProducts.length}
        isSearching={searchQuery !== debouncedSearch}
      />

      <div
        className='flex-1 min-h-0 overflow-y-auto bg-white shadow-sm'
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <>
          <InventoryTable
            data={filteredProducts}
            stockFilter={stockFilter}
            debouncedSearch={debouncedSearch}
            onAddClick={() => setShowModal(true)}
          />
          {isFetchingNextPage && (
            <div className='p-4'>
              {Array.from({ length: 3 }).map((_, i) => (
                <TableRowSkeleton key={i} asTr={false} />
              ))}
            </div>
          )}
        </>
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
