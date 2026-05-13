import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiX, FiSearch, FiChevronDown, FiArrowLeft } from 'react-icons/fi';

import { fetchInventory } from '../../services/inventoryService';
import { fetchProducts } from '../../services/productService';
import { transferItems } from '../../services/transferService';
import { TransferProductListSkeleton } from '../Common/Skeleton';
import {
  setStep,
  setFromInventory,
  setToInventory,
  setFromDropdownOpen,
  setToDropdownOpen,
  toggleItem,
  removeItem,
  setQuantity,
  setSearchQuery,
  setLocationError,
  setSelectionError,
  clearSelection,
  resetTransfer,
} from '../../store/transferSlice';
import GreenButton from '../Common/GreenButton';
import WhiteButton from '../Common/WhiteButton';
import TransferInventoryDropdown from './TransferInvDropdown';

export default function TransferItemModal({
  open,
  onClose,
  selectedInventory,
  onTransferSuccess,
}) {
  const dispatch = useDispatch();
  const {
    step,
    fromInventory,
    toInventory,
    fromDropdownOpen,
    toDropdownOpen,
    selectedItems,
    quantities,
    searchQuery,
    locationError,
    selectionError,
  } = useSelector((s) => s.transfer);

  // Reset on close
  useEffect(() => {
    if (!open) {
      dispatch(resetTransfer());
      setSearchInputValue('');
      setDebouncedSearch('');
      setSearchDropdownOpen(false);
      setSearchFocused(false);
    }
  }, [open]);

  // Default fromInventory to currently selected
  useEffect(() => {
    if (open && selectedInventory)
      dispatch(setFromInventory(selectedInventory));
  }, [open, selectedInventory]);

  // Fetch inventories
  const { data: inventoriesData } = useQuery({
    queryKey: ['inventories'],
    queryFn: fetchInventory,
    enabled: open,
    select: (data) => {
      const list = data.Data || data.data || [];
      return list.filter(
        (inv) => inv.permission === 'Editor' || inv.accessType === 'Editor',
      );
    },
  });
  const inventories = inventoriesData || [];

  // If fromInventory changes to same as toInventory, reset toInventory
  useEffect(() => {
    if (fromInventory && toInventory && fromInventory.id === toInventory.id) {
      dispatch(setToInventory(null));
    }
  }, [fromInventory]);

  useEffect(() => {
    if (!open) return;

    // whenever inventory changes → reset step 2 data
    dispatch(toggleItem([])); //  this won't work (explained below)
  }, [fromInventory, toInventory]);

  useEffect(() => {
    if (!open) return;

    // reset items when inventory changes
    dispatch(clearSelection());

    // also reset local search states
    setSearchInputValue('');
    setDebouncedSearch('');
    setSearchDropdownOpen(false);
    setSearchFocused(false);
  }, [fromInventory, toInventory]);

  // Fetch products for step 2
  const inventoryId =
    fromInventory?.id || fromInventory?._id || fromInventory?.inventoryId;

  const { data: products = [], isFetching: loadingProducts } = useQuery({
    queryKey: ['products', inventoryId],

    queryFn: async () => {
      if (!inventoryId) return [];
      return fetchProducts({ inventoryId });
    },

    enabled: step === 2 && !!inventoryId,
    staleTime: 0,
  });

  const queryClient = useQueryClient();

  const transferMutation = useMutation({
    mutationFn: async (payload) => {
      // console.log('Transfer payload:', payload);
      return transferItems(payload);
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['products', fromInventory?.id],
      });

      queryClient.invalidateQueries({
        queryKey: ['stock-value', fromInventory?.id],
      });

      queryClient.invalidateQueries({
        queryKey: ['products', toInventory?.id],
      });

      queryClient.invalidateQueries({
        queryKey: ['stock-value', toInventory?.id],
      });

      onClose();

      if (onTransferSuccess) {
        onTransferSuccess({ transferId: data?.Data?.transferId });
      }
    },

    onError: (err) => {
      console.error('Transfer error:', err);
    },
  });

  // Search input state for debounce & dropdown
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [showFooterError, setShowFooterError] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const searchRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInputValue);
      dispatch(setSearchQuery(searchInputValue));
      setIsDebouncing(false);
    }, 400);
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

  if (!open) return null;

  const fromName = fromInventory?.name || '---';
  const toName = toInventory?.name || '';
  const progress = (step / 3) * 100;

  const filteredProducts = products
    .filter((p) => Number(p.totalQuantity ?? p.quantity ?? 0) > 0)
    .filter((p) =>
      p.productName?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  function handleStep1Continue() {
    if (!fromInventory || !toInventory) {
      dispatch(setLocationError(true));
      return;
    }
    dispatch(setLocationError(false));
    setShowFooterError(false);
    dispatch(setStep(2));
  }

  function handleStep2Continue() {
    if (selectedItems.length === 0) {
      dispatch(setSelectionError(true));
      return;
    }
    dispatch(setSelectionError(false));
    setShowFooterError(false);
    dispatch(setStep(3));
  }

  function handleTransfer() {
    if (selectedItems.length === 0) {
      setShowFooterError(true);
      return;
    }

    const hasInvalidQty = selectedItems.some((item) => {
      const qty = Number(quantities[item.id]);

      return (
        !qty || // empty / undefined
        qty <= 0 || // zero or negative
        qty > item.totalQuantity // exceeds available
      );
    });

    if (hasInvalidQty) {
      dispatch(setSelectionError(true));
      return;
    }

    setShowFooterError(false);
    dispatch(setSelectionError(false));

    transferMutation.mutate({
      fromInventoryId: fromInventory?.id,
      toInventoryId: toInventory?.id,
      items: selectedItems.flatMap((i) =>
        (i.products || []).map((batch) => ({
          storeProductId: batch.storeProductId,
          quantity: quantities[i.id],
        })),
      ),
    });
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[0.5px]'>
      <div
        className='bg-white rounded-lg shadow-xl flex flex-col w-360 h-217 max-w-[95vw]'
        style={{ minHeight: '560px', maxHeight: '100vh', overflowX: 'hidden' }}
      >
        {/* HEADER */}
        <div className='flex items-center justify-between px-6 py-5 border-b border-gray-200'>
          <div className='flex items-center gap-4'>
            <span className='text-[17px] pl-5 font-bold text-gray-900'>
              {step === 1
                ? 'Transfer items'
                : `Transfer items from ${fromName}`}
            </span>
            <span className='text-[15px] font-bold text-gray-900'>
              Step {step}/3
            </span>
          </div>
          <button onClick={onClose} className='text-gray-700'>
            <FiX size={22} />
          </button>
        </div>

        <div
          className={`flex-1 flex flex-col min-h-0 ${step !== 2 ? 'overflow-y-auto px-6 py-6' : 'overflow-hidden'}`}
        >
          {/* STEP 1 */}
          {step === 1 && (
            <div className='px-6 py-6'>
              <div className='max-w-sm'>
                <h2 className='text-[18px] font-bold text-gray-900 mb-6'>
                  Select location
                </h2>

                <TransferInventoryDropdown
                  label='From'
                  value={fromInventory}
                  inventories={inventories}
                  isOpen={fromDropdownOpen}
                  setOpen={(val) => dispatch(setFromDropdownOpen(val))}
                  onSelect={(inv) => dispatch(setFromInventory(inv))}
                />

                <TransferInventoryDropdown
                  label='To'
                  value={toInventory}
                  inventories={inventories}
                  isOpen={toDropdownOpen}
                  setOpen={(val) => dispatch(setToDropdownOpen(val))}
                  onSelect={(inv) => dispatch(setToInventory(inv))}
                  excludeId={fromInventory?.id}
                />

                {locationError && (
                  <p className='text-red-700 text-xs mt-1 pl-5'>
                    Please select 'From' and 'To' location.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className='flex flex-1 self-stretch' style={{ minHeight: 0 }}>
              {/* Left panel */}
              <div
                className='flex flex-col flex-1 pl-6 mt-3 mb-3'
                style={{ borderRight: '1px solid #e5e7eb', margin: 0 }}
              >
                <h2 className='text-[22px] font-bold text-gray-900 mt-3 mb-4 pl-5 px-6 pt-2'>
                  Pick items to transfer
                </h2>

                {/* Search input with dropdown */}
                <div className='px-6 mb-0' ref={searchRef}>
                  <div className='relative'>
                    <div
                      className={`flex items-center border rounded px-3 gap-2 transition-colors ${
                        searchFocused
                          ? 'border-emerald-500 ring-1 ring-emerald-500'
                          : 'border-gray-300'
                      }`}
                    >
                      <FiSearch size={15} className='text-gray-400 shrink-0' />
                      <input
                        type='text'
                        placeholder='Search items...'
                        value={searchInputValue}
                        onFocus={() => {
                          setSearchFocused(true);
                          setSearchDropdownOpen(true);
                        }}
                        onChange={(e) => {
                          setSearchInputValue(e.target.value);
                          setIsDebouncing(true);
                          setSearchDropdownOpen(true);
                        }}
                        className='w-full py-2 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400'
                      />
                      <FiChevronDown
                        size={15}
                        className='text-gray-400 shrink-0'
                      />
                    </div>

                    {/* Search dropdown - only shows when typing */}
                    {searchDropdownOpen && searchFocused && (
                      <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-48 overflow-y-auto'>
                        {searchInputValue.trim() === '' ? (
                          <div className='px-4 py-3 text-sm text-gray-400'>
                            No options
                          </div>
                        ) : isDebouncing ? (
                          <div className='px-4 py-3 text-sm text-gray-400'>
                            Loading...
                          </div>
                        ) : filteredProducts.length === 0 ? (
                          <div className='px-4 py-3 text-sm text-gray-400'>
                            No options
                          </div>
                        ) : (
                          <div className='flex flex-col gap-1.5'>
                            {filteredProducts.map((product) => {
                              const sel = selectedItems.some(
                                (i) => i.id === product.id,
                              );
                              return (
                                <div
                                  key={product.id}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    dispatch(toggleItem(product));
                                  }}
                                  className={`flex items-center gap-3 px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                    sel ? 'bg-emerald-50' : 'hover:bg-gray-50'
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                                      sel
                                        ? 'bg-emerald-600 border-emerald-600'
                                        : 'border-gray-300 bg-white'
                                    }`}
                                  >
                                    {sel && (
                                      <svg
                                        className='w-2.5 h-2.5 text-white'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeWidth='3'
                                      >
                                        <path d='M5 13l4 4L19 7' />
                                      </svg>
                                    )}
                                  </div>
                                  <span className='text-gray-700'>
                                    {product.productName}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className='border-b border-gray-200 mt-7.5' />

                {/* Product list */}
                <div className='flex-1 overflow-y-auto px-6 pt-10'>
                  {loadingProducts ? (
                    <TransferProductListSkeleton />
                  ) : (
                    <div className='flex flex-col gap-1.5'>
                      {filteredProducts.map((product) => {
                        const sel = selectedItems.some(
                          (i) => i.id === product.id,
                        );
                        return (
                          <div
                            key={product.id}
                            onClick={() => dispatch(toggleItem(product))}
                            className={`flex items-center gap-1 px-3 py-3.5 transition-colors rounded ${
                              sel ? 'bg-emerald-50' : ''
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 ${
                                sel
                                  ? 'bg-emerald-600 border-emerald-600'
                                  : 'border-gray-300 bg-white'
                              }`}
                            >
                              {sel && (
                                <svg
                                  className='w-3 h-3 text-white'
                                  viewBox='0 0 24 24'
                                  fill='none'
                                  stroke='currentColor'
                                  strokeWidth='3'
                                >
                                  <path d='M5 13l4 4L19 7' />
                                </svg>
                              )}
                            </div>
                            <span className='text-sm text-gray-700'>
                              {product.productName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right panel — Selected items */}
              <div className='flex flex-col shrink-0 overflow-y-auto bg-gray-50 w-125'>
                <h2 className='text-[22px] font-bold text-gray-900 px-10 pt-8 pb-4'>
                  Selected items
                </h2>
                <div className='flex flex-col px-6'>
                  {selectedItems.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-center justify-between py-4 px-4'
                    >
                      <span className='text-sm text-gray-800'>
                        {item.productName}
                      </span>
                      <button
                        onClick={() => dispatch(removeItem(item.id))}
                        className='text-gray-500 ml-3 shrink-0'
                      >
                        <FiX size={19} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className='flex flex-col min-h-0 flex-1'>
              <div className='px-8 py-6 mb-3 border-b border-gray-200'>
                <h2 className='text-[20px] font-bold text-gray-900'>
                  Specify quantities
                </h2>
              </div>

              <div className='mt-2 mb-2 border border-gray-200 rounded flex-1 overflow-y-auto'>
                {selectedItems.length === 0 ? (
                  <div className='flex items-center justify-center h-full text-gray-400 text-sm'>
                    Sorry no product found
                  </div>
                ) : (
                  selectedItems.map((item, i) => (
                    <div
                      key={item.id}
                      className={`flex items-center px-6 py-6 gap-4 ${i !== selectedItems.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >
                      {/* Product name */}
                      <span className='text-sm text-gray-800 w-40 font-medium'>
                        {item.productName}
                      </span>

                      {/* Available */}
                      <span className='text-sm text-gray-400 flex-1'>
                        {Number(item.totalQuantity ?? 0).toFixed(2)} available
                        to transfer
                      </span>

                      {/* Input + unit */}
                      <div className='flex flex-col items-end shrink-0'>
                        <div className='flex items-center bg-gray-100 rounded-md overflow-hidden'>
                          <input
                            type='number'
                            min={0}
                            max={item.totalQuantity}
                            value={quantities[item.id] ?? ''}
                            onChange={(e) =>
                              dispatch(
                                setQuantity({
                                  id: item.id,
                                  value: e.target.value,
                                }),
                              )
                            }
                            className='w-20 px-3 py-2 text-sm bg-transparent outline-none text-right text-gray-800'
                            // placeholder='0'
                          />

                          <span className='px-3 py-2 text-sm text-gray-700 whitespace-nowrap'>
                            {(() => {
                              const qty = Number(quantities[item.id]);
                              const unitPlural =
                                item.stockTakingUnitPlural || item.unit || '';

                              if (qty === 1) {
                                // convert plural → singular (basic rule)
                                return unitPlural.endsWith('s')
                                  ? unitPlural.slice(0, -1)
                                  : unitPlural;
                              }

                              return unitPlural;
                            })()}
                          </span>
                        </div>

                        {/* Error (only show when needed) */}
                        {(quantities[item.id] <= 0 ||
                          quantities[item.id] > item.totalQuantity) && (
                          <span className='text-xs text-red-500 mt-1'>
                            {quantities[item.id] <= 0
                              ? 'Quantity must be greater than 0'
                              : `Qty equal or less than ${item.totalQuantity}`}
                          </span>
                        )}
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => dispatch(removeItem(item.id))}
                        className='text-gray-700 ml-2'
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div>
          <div className='flex items-center justify-between px-6 py-4 border-t border-gray-100'>
            <WhiteButton onClick={onClose}>Cancel</WhiteButton>

            {(selectionError || showFooterError) && (
              <div className='w-[60%] bg-[#fff0f1] text-[#a71a23] font-semibold text-[14px] leading-4.5 rounded px-3 py-2 flex items-center'>
                <img src='/icons/error.svg' className='w-5 ml-2 mr-2' />
                <span className='ml-2'>
                  {step === 3 && selectedItems.length === 0
                    ? 'Please select products to transfer'
                    : 'Please select products or set qty to transfer'}
                </span>
              </div>
            )}

            <div className='flex items-center gap-3'>
              {step > 1 && (
                <WhiteButton
                  onClick={() => {
                    queryClient.invalidateQueries({
                      queryKey: ['products', fromInventory?.id],
                    });
                    dispatch(setStep(step - 1));
                    setShowFooterError(false);
                  }}
                  className='flex items-center gap-1 text-sm px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 hover:border-gray-900 transition'
                >
                  <FiArrowLeft size={14} />
                  Previous step
                </WhiteButton>
              )}

              {step < 3 && (
                <GreenButton
                  onClick={
                    step === 1 ? handleStep1Continue : handleStep2Continue
                  }
                >
                  Continue →
                </GreenButton>
              )}

              {step === 3 && (
                <button
                  disabled={transferMutation.isPending}
                  onClick={handleTransfer}
                  className='flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm px-5 py-2 rounded font-medium transition'
                >
                  {transferMutation.isPending
                    ? ' Please wait'
                    : `Transfer to ${toName}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
