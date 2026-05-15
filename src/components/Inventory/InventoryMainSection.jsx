import { useState } from 'react';
import { FiPlus, FiSearch, FiChevronDown } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import { fetchSuppliers } from '../../services/supplierService';
import { fetchStockValue } from '../../services/inventoryService';
import { downloadInventoryCSV } from '../../services/inventoryDownloadService';
import { formatPrice } from '../../utils/format';
import { SkeletonBar, StockValueSkeleton } from '../Common/Skeleton';
import GreenButton from '../Common/GreenButton';
import SupplierDropdown from '../Common/SupplierDropDown';
import StockDropdown from '../Common/StockDropDown';

export default function InventoryMainSection({
  setShowModal,
  products,
  stockFilter,
  setStockFilter,
  searchQuery,
  setSearchQuery,
  setShowTransfer,
  isProductsFetching,
  selectedSupplier,
  setSelectedSupplier,
  headerScrolled,
}) {
  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);
  const isViewOnly = selectedInventory?.permission === 'Viewer';

  const [openSupplierDropdown, setOpenSupplierDropdown] = useState(false);
  const [openStockDropdown, setOpenStockDropdown] = useState(false);

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: false,
  });

  console.log('suppliers sample:', suppliers[0]);

  const {
    data: stockData,
    isLoading: loadingStock,
    isFetching: fetchingStock,
  } = useQuery({
    queryKey: ['stock-value', selectedInventory?.id],
    queryFn: () => fetchStockValue(selectedInventory.id),
    enabled: !!selectedInventory?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnMount: false,
  });
  console.log('stockData:', stockData);

  const stockValue = Number(stockData?.Data?.totalStockValue ?? 0);

  const itemCount =
    stockData?.Data?.totalItems ??
    products.filter((p) => Number(p.quantity ?? 0) > 0).length;

  const isDownloadDisabled = itemCount === 0;

  const STOCK_OPTIONS = [
    { label: 'All items', value: 'all' },
    { label: 'In stock', value: 'in' },
    { label: 'Low in stock', value: 'low' },
    { label: 'Out of stock', value: 'out' },
  ];

  const handleDownloadCSV = async () => {
    console.log('handleDownloadCSV clicked');

    const blob = await downloadInventoryCSV({
      inventoryId: selectedInventory?.id,
      name: searchQuery,
      supplierIds: selectedSupplier?.Id,
      stockFilter,
    });

    const text = await blob.text();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    const timestamp = Date.now();
    a.download = `totalctrl_inventory_report_${timestamp}.xlsx`;

    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className='ml-5 px-6 bg-white'>
      <div className='pt-10 pb-4 '>
        {/* Title + Buttons */}
        <div className='flex items-center justify-between mb-2'>
          <div>
            {fetchingStock ? (
              <SkeletonBar className='h-8 w-60' />
            ) : (
              <h2 className='text-3xl font-semibold text-gray-800'>
                {selectedInventory?.name || '---'}
              </h2>
            )}
          </div>

          <div className='flex gap-4'>
            {fetchingStock ? (
              <>
                <SkeletonBar className='h-9 w-36 rounded-sm' />
                <SkeletonBar className='h-9 w-36 rounded-sm' />
                <SkeletonBar className='h-9 w-28 rounded-sm' />
              </>
            ) : (
              <>
                <button
                  onClick={() => !isDownloadDisabled && handleDownloadCSV()}
                  style={{
                    cursor: isDownloadDisabled ? 'not-allowed' : 'pointer',
                  }}
                  className={`flex items-center gap-2 border w-40 px-3 py-2 rounded-sm text-sm font-extrabold transition
                  ${isDownloadDisabled ? 'border-gray-200 text-gray-400' : 'border-gray-300 text-gray-950 hover:border-gray-400'}`}
                >
                  <img
                    src='/icons/download.svg'
                    width={16}
                    height={16}
                    alt=''
                  />
                  Download CSV
                </button>
                <button
                  onClick={() => !isViewOnly && setShowTransfer(true)}
                  style={{ cursor: isViewOnly ? 'not-allowed' : 'pointer' }}
                  className={`flex items-center gap-2 border w-40 px-3 py-2 rounded-sm text-sm font-extrabold transition
                  ${isViewOnly ? 'border-gray-200 text-gray-400' : 'border-gray-300 text-gray-950 hover:border-gray-400'}`}
                >
                  <img
                    src='/icons/swap-horizontal.svg'
                    width={16}
                    height={16}
                    alt=''
                  />
                  Transfer items
                </button>
                <GreenButton
                  disabled={isViewOnly}
                  onClick={() => !isViewOnly && setShowModal(true)}
                  className={
                    isViewOnly
                      ? 'opacity-50 cursor-not-allowed pointer-events-none'
                      : ''
                  }
                >
                  <img
                    src='icons/plus_icon.png'
                    alt='add'
                    className='w-4 h-4 object-contain'
                  />
                  Add items
                </GreenButton>
              </>
            )}
          </div>
        </div>

        {/* STATS — hidden when scrolled */}
        <div
          style={{
            maxHeight: headerScrolled ? 0 : 80,
            opacity: headerScrolled ? 0 : 1,
            overflow: 'hidden',
            transition: 'max-height 0.3s ease, opacity 0.2s ease',
          }}
        >
          <div className='flex gap-3 text-sm mt-3 mb-3'>
            <div>
              {fetchingStock ? (
                <>
                  <SkeletonBar className='h-3 w-24 mb-2' />
                  <SkeletonBar className='h-5 w-8' />
                </>
              ) : (
                <>
                  <p className='text-gray-500 text-xs uppercase tracking-wide'>
                    Items in stock
                  </p>
                  <p className='font-semibold text-sm text-gray-900 mt-1'>
                    {itemCount}
                  </p>
                </>
              )}
            </div>
            <div className='h-10 w-px bg-gray-200 mx-2' />
            <div>
              {loadingStock || fetchingStock ? (
                <>
                  <SkeletonBar className='h-3 w-28 mb-2' />
                  <StockValueSkeleton />
                </>
              ) : (
                <>
                  <p className='text-gray-500 text-xs uppercase tracking-wide'>
                    Total stock value
                  </p>
                  <p className='font-semibold text-sm text-gray-900 mt-1'>
                    {formatPrice(stockValue)}
                  </p>
                </>
              )}
            </div>
            <div className='h-10 w-px bg-gray-200 mx-2' />
            <div>
              {fetchingStock ? (
                <>
                  <SkeletonBar className='h-3 w-24 mb-2' />
                  <SkeletonBar className='h-5 w-14' />
                </>
              ) : (
                <>
                  <p className='text-gray-500 text-xs uppercase tracking-wide'>
                    Your access type
                  </p>
                  <p className='font-semibold text-sm text-gray-900 mt-1'>
                    {selectedInventory?.permission || '---'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className='flex items-center gap-4 mt-2'>
          {fetchingStock ? (
            <>
              <SkeletonBar className='h-10 w-60 rounded-sm' />
              <SkeletonBar className='h-10 w-60 rounded-sm' />
              <SkeletonBar className='h-10 flex-1 mr-5 rounded-sm' />
            </>
          ) : (
            <>
              <SupplierDropdown
                suppliers={suppliers}
                selectedSupplier={selectedSupplier}
                setSelectedSupplier={setSelectedSupplier}
              />
              <StockDropdown
                stockFilter={stockFilter}
                setStockFilter={setStockFilter}
                options={STOCK_OPTIONS}
              />
              <div className='flex items-center border border-gray-300 rounded-sm px-3 flex-1 mr-5 transition duration-150 focus-within:border-2 focus-within:border-emerald-600'>
                <FiSearch className='text-gray-950' />
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${selectedInventory?.name || ''}...`}
                  className='w-full px-2 py-2 outline-none text-sm'
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
