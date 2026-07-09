import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiX, FiSearch, FiChevronDown, FiArrowLeft } from 'react-icons/fi';

import { fetchInventory } from '../../services/inventoryService';
import { createInternalOrder } from '../../services/internalOrderService';
import { GreenDotSkeleton } from '../Common/Skeleton';
import TransferInventoryDropdown from '../Common/TransferInvDropdown';
import GreenButton from '../Common/GreenButton';
import WhiteButton from '../Common/WhiteButton';
import Checkbox from '../Common/Checkbox';
import {
  SECTION_TITLES,
  VALIDATION_LABELS,
  EMPTY_STATE_LABELS,
} from '../../constants/titles';
import { useProductPicker } from '../../hooks/useProductPicker';
import { PERMISSIONS, canEdit } from '../../constants/permissions';

export default function AddInternalOrder({ open, onClose, onSuccess }) {
  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);

  const [step, setStep] = useState(1);
  const [fromInventory, setFromInventory] = useState(null);
  const [toInventory, setToInventory] = useState(null);
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [locationError, setLocationError] = useState(false);
  const [selectionError, setSelectionError] = useState(false);
  const [showFooterError, setShowFooterError] = useState(false);

  // Fetch products for step 2
  const inventoryId =
    fromInventory?.id || fromInventory?._id || fromInventory?.inventoryId;

  const {
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
  } = useProductPicker(inventoryId, {
    enabled: step === 2,
    isInStock: '1,2',
    searchQuery,
    onSearchChange: setSearchQuery,
  });

  useEffect(() => {
    if (!open) {
      setStep(1);
      setFromInventory(null);
      setToInventory(null);
      setFromDropdownOpen(false);
      setToDropdownOpen(false);
      setSelectedItems([]);
      setQuantities({});
      setSearchQuery('');
      setLocationError(false);
      setSelectionError(false);
      setShowFooterError(false);

      resetSearch();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (selectedInventory && canEdit(selectedInventory.permission)) {
      setFromInventory(selectedInventory);
    } else {
      setFromInventory(null);
    }
  }, [open, selectedInventory]);

  useEffect(() => {
    if (fromInventory && toInventory && fromInventory.id === toInventory.id) {
      setToInventory(null);
    }
  }, [fromInventory]);

  useEffect(() => {
    if (!open) return;

    setSelectedItems([]);
    setQuantities({});
    setSearchQuery('');
    resetSearch();
  }, [fromInventory, toInventory, open]);

  // Fetch inventories
  const { data: inventoriesData } = useQuery({
    queryKey: ['inventories'],
    queryFn: fetchInventory,
    enabled: open,
    select: (data) => {
      const list = data.Data || data.data || [];
      return list.filter(
        (inv) => canEdit(inv.permission) || canEdit(inv.accessType),
      );
    },
  });

  const inventories = inventoriesData || [];

  const queryClient = useQueryClient();
  //  Create internal order mutation
  const createMutation = useMutation({
    mutationFn: (payload) => createInternalOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-order'] });
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      console.error('Internal order error:', err);
    },
  });

  if (!open) return null;

  const fromName = fromInventory?.name || '---';
  const toName = toInventory?.name || '';

  function toggleItem(product) {
    setSelectedItems((prev) => {
      const exists = prev.some((i) => i.id === product.id);
      if (exists) {
        setQuantities((q) => {
          const copy = { ...q };
          delete copy[product.id];
          return copy;
        });
        return prev.filter((i) => i.id !== product.id);
      }
      return [...prev, product];
    });
  }

  function removeItem(id) {
    setSelectedItems((prev) => prev.filter((i) => i.id !== id));
    setQuantities((q) => {
      const copy = { ...q };
      delete copy[id];
      return copy;
    });
  }

  function updateQuantity(id, value) {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  }

  function handleStep1Continue() {
    if (!fromInventory || !toInventory) {
      setLocationError(true);
      return;
    }
    setLocationError(false);
    setShowFooterError(false);
    setStep(2);
  }

  function handleStep2Continue() {
    if (selectedItems.length === 0) {
      setSelectionError(true);
      return;
    }
    setSelectionError(false);
    setShowFooterError(false);
    setStep(3);
  }

  function handleSubmit() {
    if (selectedItems.length === 0) {
      setShowFooterError(true);
      return;
    }

    const hasInvalidQty = selectedItems.some((item) => {
      const qty = Number(quantities[item.id]);
      return !qty || qty <= 0 || qty > item.totalQuantity;
    });

    if (hasInvalidQty) {
      setSelectionError(true);
      return;
    }

    setShowFooterError(false);
    setSelectionError(false);

    const payload = {
      fromInventoryId: fromInventory?.id,
      toInventoryId: toInventory?.id,
      products: selectedItems.map((item) => ({
        storeProductItemId: item.products?.[0]?.storeProductId,
        quantity: Number(quantities[item.id]),
      })),
    };
    console.log('payload being sent:', JSON.stringify(payload, null, 2));
    createMutation.mutate(payload);
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
            <span className='text-[20px] pl-5 font-semibold text-gray-900'>
              {step === 1 ? 'Order items' : `Order items from ${fromName}`}
            </span>
            <span className='text-[18px] font-semibold text-gray-900'>
              Step {step}/3
            </span>
          </div>
          <button onClick={onClose} className='text-gray-700'>
            <FiX size={22} />
          </button>
        </div>

        <div
          className={`flex-1 flex flex-col min-h-0 ${step === 2 ? 'overflow-hidden' : 'overflow-y-auto'}`}
        >
          {/* STEP 1  */}
          {step === 1 && (
            <div className='px-15 py-8'>
              <div className='max-w-sm'>
                <h2 className='text-[20px] font-semibold text-gray-900 mb-6'>
                  {SECTION_TITLES.SELECT_LOCATION}
                </h2>

                <TransferInventoryDropdown
                  label='From'
                  value={fromInventory}
                  inventories={inventories}
                  isOpen={fromDropdownOpen}
                  setOpen={setFromDropdownOpen}
                  onSelect={(inv) => setFromInventory(inv)}
                />

                <TransferInventoryDropdown
                  label='To'
                  value={toInventory}
                  inventories={inventories}
                  isOpen={toDropdownOpen}
                  setOpen={setToDropdownOpen}
                  onSelect={(inv) => setToInventory(inv)}
                  excludeId={fromInventory?.id}
                />

                {locationError && (
                  <p className='text-red-700 text-sm pl-5'>
                    {VALIDATION_LABELS.SELECT_FROM_TO_LOCATION}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2  */}
          {step === 2 && (
            <div className='flex flex-1 self-stretch' style={{ minHeight: 0 }}>
              {/* Left panel */}
              <div
                className='flex flex-col flex-1 pl-6 mt-3 mb-3'
                style={{ borderRight: '1px solid #e5e7eb', margin: 0 }}
              >
                <h2 className='text-[24px] font-semibold text-gray-900 mt-3 mb-4 pl-5 px-6 pt-2'>
                  {SECTION_TITLES.PICK_ITEMS_TO_ORDER}
                </h2>

                {/* Search */}
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
                        onChange={(e) =>
                          handleSearchInputChange(e.target.value)
                        }
                        className='w-full py-2 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400'
                      />
                      <FiChevronDown
                        size={15}
                        className='text-gray-400 shrink-0'
                      />
                    </div>

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
                                    toggleItem(product);
                                  }}
                                  className={`flex items-center gap-3 px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                                    sel ? 'bg-emerald-50' : 'hover:bg-gray-50'
                                  }`}
                                >
                                  <Checkbox
                                    className='pb-5'
                                    checked={sel}
                                    onChange={() => toggleItem(product)}
                                  />
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

                <div className='border-b border-gray-200 mt-7.5' />

                {/* Product list */}
                <div
                  className='flex-1 overflow-y-auto px-6 pt-10'
                  onScroll={handleScroll}
                >
                  {loadingProducts && !isFetchingNextPage ? (
                    <GreenDotSkeleton />
                  ) : (
                    <div>
                      {filteredProducts.map((product) => {
                        const sel = selectedItems.some(
                          (i) => i.id === product.id,
                        );
                        return (
                          <div
                            key={product.id}
                            onClick={() => toggleItem(product)}
                            style={{
                              padding: '14px 24px',
                              display: 'flex',
                              marginRight: 24,
                              marginBottom: 5,
                              color: '#19191c',
                              fontWeight: 400,
                              fontSize: 14,
                              lineHeight: '20px',
                              cursor: 'pointer',
                              backgroundColor: sel ? '#f0fdf4' : 'transparent',
                            }}
                          >
                            <div style={{ width: 36, flexShrink: 0 }}>
                              <Checkbox
                                checked={sel}
                                onChange={() => toggleItem(product)}
                              />
                            </div>
                            <div>{product.productName}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right panel — Selected items */}
              <div className='flex flex-col shrink-0 overflow-y-auto bg-gray-50 w-125'>
                <h2 className='text-[24px] font-semibold text-gray-900 px-10 pt-8 pb-4'>
                  {SECTION_TITLES.SELECTED_ITEMS}
                </h2>
                <div className='flex flex-col px-6'>
                  {selectedItems.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-center justify-between py-4 px-4'
                    >
                      <span className='text-[14px] text-gray-800'>
                        {item.productName}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
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

          {/* STEP 3  */}
          {step === 3 && (
            <div className='flex flex-col min-h-0 flex-1 overflow-y-auto'>
              <div style={{ marginLeft: 48, marginTop: 32, marginBottom: 32 }}>
                <h2
                  style={{
                    fontSize: 24,
                    lineHeight: '32px',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    color: '#19191c',
                    textAlign: 'left',
                    marginBottom: 0,
                  }}
                >
                  {SECTION_TITLES.SPECIFY_QUANTITIES}
                </h2>
              </div>

              <hr
                style={{
                  margin: '0 -24px',
                  borderTop: '1px solid rgba(0,0,0,0.1)',
                  width: 'calc(100% + 48px)',
                }}
              />

              <div
                style={{
                  marginLeft: 48,
                  marginTop: 0,
                  marginBottom: 10,
                  paddingRight: 24,
                }}
              >
                {selectedItems.length === 0 ? (
                  <div
                    style={{
                      border: '1px solid #dee2e6',
                      borderRadius: 4,
                      marginTop: 10,
                      marginBottom: 24,
                      marginLeft: 5,
                      marginRight: 5,
                      minHeight: 70,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: 18,
                        lineHeight: '24px',
                        letterSpacing: '-0.01em',
                        color: '#19191c',
                        margin: 0,
                      }}
                    >
                      {EMPTY_STATE_LABELS.NO_PRODUCT_FOUND}
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      border: '1px solid #dee2e6',
                      borderRadius: 4,
                      marginTop: 10,
                      padding: '0 24px',
                    }}
                  >
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: 12,
                        marginTop: 20,
                        marginBottom: 20,
                      }}
                    >
                      <tbody>
                        {selectedItems.map((item, i) => {
                          const qty = Number(quantities[item.id]);
                          const unitPlural =
                            item.stockTakingUnitPlural ||
                            item.stockTakingUnit ||
                            '';
                          const unitLabel =
                            qty === 1
                              ? unitPlural.endsWith('s')
                                ? unitPlural.slice(0, -1)
                                : unitPlural
                              : unitPlural;
                          const isLast = i === selectedItems.length - 1;

                          return (
                            <tr
                              key={item.id}
                              style={{
                                borderBottom: isLast
                                  ? 'none'
                                  : '1px solid #e6e6ed',
                                height: 95,
                              }}
                            >
                              {/* Product name */}
                              <td
                                style={{
                                  width: '30%',
                                  verticalAlign: 'middle',
                                  padding: 0,
                                  borderTop: 0,
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 400,
                                    fontSize: 14,
                                    lineHeight: '20px',
                                    color: '#19191c',
                                  }}
                                >
                                  {item.productName}
                                </span>
                              </td>

                              {/* Available */}
                              <td
                                style={{
                                  width: '25%',
                                  verticalAlign: 'middle',
                                  padding: 0,
                                  borderTop: 0,
                                }}
                              >
                                <span
                                  style={{ fontSize: 14, color: '#19191c' }}
                                >
                                  {Number(item.totalQuantity ?? 0)} available to
                                  order
                                </span>
                              </td>

                              {/* Input + unit */}
                              <td
                                style={{
                                  width: '30%',
                                  verticalAlign: 'middle',
                                  padding: 0,
                                  borderTop: 0,
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#f1f1f5',
                                    borderRadius: 4,
                                    width: 160,
                                    height: 36,
                                    overflow: 'hidden',
                                  }}
                                >
                                  <input
                                    type='text'
                                    value={quantities[item.id] ?? ''}
                                    onChange={(e) =>
                                      updateQuantity(item.id, e.target.value)
                                    }
                                    style={{
                                      border: 'none',
                                      outline: 'none',
                                      flex: 1,
                                      minWidth: 0,
                                      backgroundColor: '#f1f1f5',
                                      padding: '0 8px',
                                      fontSize: 12,
                                      lineHeight: '24px',
                                      color: '#333',
                                    }}
                                  />
                                  <span
                                    style={{
                                      paddingRight: 12,
                                      paddingLeft: 4,
                                      color: '#19191c',
                                      fontSize: 14,
                                      whiteSpace: 'nowrap',
                                      flexShrink: 0,
                                    }}
                                  >
                                    {unitLabel}
                                  </span>
                                </div>
                                {quantities[item.id] !== undefined &&
                                  quantities[item.id] !== '' &&
                                  (qty <= 0 || qty > item.totalQuantity) && (
                                    <span
                                      style={{
                                        fontSize: 12,
                                        color: '#e2232e',
                                        marginTop: 4,
                                        display: 'block',
                                      }}
                                    >
                                      {qty <= 0
                                        ? 'Quantity must be greater than 0'
                                        : `Qty equal or less than ${item.totalQuantity}`}
                                    </span>
                                  )}
                              </td>

                              {/* Remove */}
                              <td
                                style={{
                                  width: '15%',
                                  verticalAlign: 'middle',
                                  padding: 0,
                                  textAlign: 'right',
                                  borderTop: 0,
                                }}
                              >
                                <button
                                  onClick={() => removeItem(item.id)}
                                  style={{
                                    cursor: 'pointer',
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                  }}
                                >
                                  <FiX size={24} color='#19191c' />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div>
          <div className='flex items-center justify-between px-6 py-4 border-t border-gray-100'>
            <WhiteButton
              className='border border-gray-300 rounded text-gray-700 hover:border-gray-900 hover:text-gray-900 transition'
              onClick={onClose}
            >
              Cancel
            </WhiteButton>

            {(selectionError || showFooterError) && (
              <div className='w-[60%] bg-[#fff0f1] text-[#a71a23] font-semibold text-[14px] leading-4.5 rounded px-3 py-2 flex items-center'>
                <img src='/icons/error.svg' className='w-5 ml-2 mr-2' />
                <span className='ml-2'>
                  {step === 3 && selectedItems.length === 0
                    ? 'Please select products or set qty to order'
                    : 'Please select products to order'}
                </span>
              </div>
            )}

            <div className='flex items-center gap-3'>
              {step > 1 && (
                <WhiteButton
                  onClick={() => {
                    setStep((s) => s - 1);
                    setShowFooterError(false);
                    setSelectionError(false);
                  }}
                  className='flex items-center gap-1 border border-gray-300 rounded text-gray-700 hover:border-gray-900 transition'
                >
                  <img
                    src='/icons/arrow-left.svg'
                    alt=''
                    width={16}
                    height={16}
                  />
                  Previous step
                </WhiteButton>
              )}

              {step < 3 && (
                <GreenButton
                  onClick={
                    step === 1 ? handleStep1Continue : handleStep2Continue
                  }
                >
                  Continue
                  <img
                    src='/icons/arrow-right.svg'
                    alt=''
                    width={16}
                    height={16}
                  />
                </GreenButton>
              )}

              {step === 3 && (
                <GreenButton
                  disabled={createMutation.isPending}
                  onClick={handleSubmit}
                >
                  {createMutation.isPending
                    ? 'Please wait...'
                    : `Order to ${toName}`}
                </GreenButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
