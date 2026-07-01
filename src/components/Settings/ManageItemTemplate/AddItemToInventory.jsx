import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

import { fetchInventory } from '../../../services/inventoryService';
import WhiteButton from '../../Common/WhiteButton';
import GreenButton from '../../Common/GreenButton';
import FormInput from '../../Common/FormInput';
import ExpiryDatePicker from './common/EXpiryDatePicker';
import { formatPrice } from '../../../utils/format';
import { addProductToInventory } from '../../../services/manageItemTemplateService';

export default function AddItemToInventory({
  isOpen,
  item,
  onClose,
  onItemAdded,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [inventoryTouched, setInventoryTouched] = useState(false);

  const [touchedCost, setTouchedCost] = useState(false);
  const [rows, setRows] = useState([
    {
      id: Date.now(),
      quantity: '',
      date: null,
      touched: false,
      calendarOpen: false,
      focused: false,
    },
  ]);

  const inventoryError = inventoryTouched && !selectedInventory;

  // const unitPrice = parseFloat(item?.purchaseUnit?.price) || 0;
  const unitPrice =
    parseFloat(
      String(item?.purchaseUnit?.price ?? '')
        .replace(/[^\d,]/g, '')
        .replace(',', '.'),
    ) || 0;
  const unitName = item?.purchaseUnit?.name ?? '';

  const [totalCost, setTotalCost] = useState('');

  const dropdownRef = useRef(null);

  const queryClient = useQueryClient();

  const { mutate: addProduct, isLoading: isSaving } = useMutation({
    mutationFn: addProductToInventory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventories'] });
      queryClient.invalidateQueries({ queryKey: ['itemTemplates'] });
      onItemAdded?.(item?.name);
      onClose();
    },
  });

  const { data: inventoryData } = useQuery({
    queryKey: ['inventories'],
    queryFn: fetchInventory,
  });

  const editableInventories = (inventoryData?.Data ?? []).filter(
    (inv) => inv.permission === 'Editor' || inv.permission === 'Owner',
  );

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  useEffect(() => {
    const totalQuantity = rows.reduce(
      (sum, r) => sum + (parseFloat(r.quantity) || 0),
      0,
    );
    if (totalQuantity > 0 && unitPrice > 0) {
      setTotalCost((totalQuantity * unitPrice).toFixed(1));
      setTouchedCost(false); // reset error when auto-filled
    } else {
      setTotalCost('');
    }
  }, [rows]);

  function addRow() {
    setRows((prev) => [
      ...prev,
      {
        id: 1,
        quantity: '',
        date: null,
        touched: false,
        calendarOpen: false,
        focused: false,
      },
    ]);
  }

  function removeRow(id) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function updateRow(id, patch) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  const totalQuantity = rows.reduce(
    (sum, r) => sum + (parseFloat(r.quantity) || 0),
    0,
  );

  function trySave() {
    setInventoryTouched(true);
    setRows((prev) => prev.map((r) => ({ ...r, touched: true })));
    setTouchedCost(true);

    if (!selectedInventory) return;

    const hasEmptyQuantity = rows.some((r) => !r.quantity);
    const hasMissingCost = !totalCost;

    if (hasEmptyQuantity || hasMissingCost) return;

    addProduct({
      inventoryId: selectedInventory?.id,
      name: item?.name,
      sku: item?.sku,
      currencyId: item?.currencyId,
      stockTakingUnitId: item?.stockTakingUnitId,
      purchaseUnitId: item?.purchaseUnitId,
      pricePerPurchaseUnit: parseFloat(totalCost),
      stockTakingQuantityPerPurchaseUnit:
        item?.stockTakingQuantityPerPurchaseUnit,
      baseMeasurementUnitId: item?.baseMeasurementUnitId,
      stockTakingQuantityPerBaseMeasurementUnit:
        item?.stockTakingQuantityPerBaseMeasurementUnit,
      products: rows.map((r) => ({
        id: item?.id ?? '0',
        quantity: parseFloat(r.quantity),
        expirationDate: r.date ? format(r.date, 'yyyy-MM-dd') : '',
        daysLeft: 0,
        selected: false,
        isManual: '1',
      })),
    });
  }
  // console.log('purchaseUnit:', item?.purchaseUnit);
  console.log(item);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40'>
      <div
        className='bg-white flex flex-col rounded-[8px]'
        style={{
          width: '75%',
          height: 'calc(100% - 48px)',
          boxShadow: '0 4px 4px rgba(0,0,0,0.12)',
        }}
      >
        {/* Header */}
        <div className='flex items-center shrink-0 px-[29px] pl-12 py-6 border-b border-[#e7e7ec] rounded-t-[4px]'>
          <h2 className='flex-1 font-semibold text-[#19191c] text-[18px] leading-6 tracking-[-0.01em] m-0 mr-[29px]'>
            Add new product to inventory
          </h2>
          <span className='cursor-pointer shrink-0' onClick={onClose}>
            <img src='/icons/closepopup-icon.svg' alt='close' />
          </span>
        </div>

        {/* Body */}
        <div className='flex-1 overflow-y-auto px-12 pb-2'>
          {/* Select Inventory section */}
          <div className='pt-[60px]'>
            <h3 className='text-[20px] font-semibold leading-7 tracking-[-0.01em] text-[#19191c] m-0 mb-2'>
              Select Inventory
            </h3>
            <div className='mt-12'>
              <div style={{ width: '288px' }}>
                <label className='block text-[11px] font-semibold uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
                  Inventory*
                </label>
                <div className='relative' ref={dropdownRef}>
                  <div
                    onClick={() => {
                      setDropdownOpen((p) => !p);
                      // setInventoryTouched(true);
                    }}
                    className='flex items-center justify-between px-4 py-3 bg-white border rounded-[3px] cursor-pointer'
                    style={{
                      height: '42px',
                      width: '288px',
                      borderColor: inventoryError ? '#e2232e' : '#d7d7db',
                      backgroundColor: inventoryError ? '#fff0f1' : '#fff',
                    }}
                  >
                    <span
                      className={`text-[14px] ${selectedInventory ? 'text-[#19191c]' : inventoryError ? 'text-[#a71a23]' : 'text-[#19191c]'}`}
                    >
                      {selectedInventory
                        ? selectedInventory.name
                        : 'Select inventory'}
                    </span>
                    <img src='/icons/chevron-down-small.svg' alt='' />
                  </div>

                  {inventoryError && (
                    <p className='text-[13px] font-normal text-[#e2232e] mt-1'>
                      This field is required
                    </p>
                  )}

                  {dropdownOpen && (
                    <ul
                      className='absolute z-10 bg-white border border-[#d7d7db] rounded-[4px] overflow-y-auto list-none p-0 mt-2'
                      style={{
                        width: '288px',
                        maxHeight: '215px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                        padding: '15px 0',
                      }}
                    >
                      {editableInventories.map((inv) => (
                        <li
                          key={inv.id}
                          onClick={() => {
                            setSelectedInventory(inv);
                            setDropdownOpen(false);
                          }}
                          className='flex justify-between text-[14px] font-normal text-[#19191c] px-5 py-2 cursor-pointer hover:bg-[#f1f1f5]'
                        >
                          {inv.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
          <hr className='my-12 border-t border-black/10' />

          {/* Enter Product Name section */}
          <div>
            <h3 className='text-[20px] font-semibold leading-7 tracking-[-0.01em] text-[#19191c] m-0 mb-2'>
              Enter product name
            </h3>
            <div className='mt-12 w-1/2'>
              <label className='block text-[11px] font-semibold uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
                product name*
              </label>
              <input
                type='text'
                disabled
                value={item?.name ?? ''}
                className='w-full border border-[#d7d8e0] rounded-[4px] px-4 py-3 text-[14px] leading-6 text-[#333] bg-[#f1f1f5] outline-none cursor-not-allowed'
              />
              {item?.purchaseUnit?.price && item?.purchaseUnit?.name && (
                <div className='text-[13px] font-normal leading-4 text-[#6b6b6f] mt-[3px]'>
                  {item.purchaseUnit.price} / {item.purchaseUnit.name}
                </div>
              )}

              {item?.stockTakingUnit?.price &&
                item?.stockTakingUnit?.name !== item?.purchaseUnit?.name && (
                  <div className='text-[13px] font-normal leading-4 text-[#6b6b6f] mt-[2px]'>
                    {item.stockTakingUnit.price} / {item.stockTakingUnit.name} (
                    1 {item.purchaseUnit.name} ={' '}
                    {item.stockTakingQuantityPerPurchaseUnit}{' '}
                    {item.stockTakingUnit.name} )
                  </div>
                )}
            </div>
          </div>
          <hr className='my-12 border-t border-black/10' />

          {/* Setup units and conversions section */}
          <div>
            <h3 className='text-[20px] font-semibold leading-7 tracking-[-0.01em] text-[#19191c] m-0 mb-2'>
              Setup units and conversions
            </h3>
            <div className='mt-12 w-1/2'>
              <div className='flex items-start bg-[#f2f1ff] rounded-[4px] p-[21px_24px_21px_30px] text-[14.5px] font-semibold leading-[18px] text-[#362a96] w-full'>
                <img
                  src='/icons/setup-unit-msg.svg'
                  alt=''
                  className='mr-5 shrink-0'
                />
                <p className='m-0 p-0'>
                  This product is already in your product database. This means
                  that its units and conversions have been already set up.
                  Please contact to the TotalCtrl Customer Support if you need
                  help to change the units and conversions
                </p>
              </div>
            </div>
          </div>
          <hr className='my-12 border-t border-black/10' />

          {/* Specify quantity and shelf life section */}
          <div>
            <h3 className='text-[20px] font-semibold leading-7 tracking-[-0.01em] text-[#19191c] m-0 mb-2'>
              Specify quantity and shelf life
            </h3>

            <div className='mt-12 flex flex-col gap-4'>
              {rows.map((row, index) => (
                <div key={row.id}>
                  {/* {console.log(index, row.id)} */}
                  <div className='flex items-start gap-10'>
                    {/* Quantity */}
                    <div>
                      <label className='block text-[11px] font-semibold uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
                        Quantity*
                      </label>

                      <FormInput
                        value={row.quantity}
                        onChange={(e) =>
                          updateRow(row.id, {
                            quantity: e.target.value.replace(/[^\d.]/g, ''),
                          })
                        }
                        onBlur={() =>
                          updateRow(row.id, { focused: false, touched: true })
                        }
                        placeholder='Enter quantity'
                        suffix={item?.purchaseUnit?.name}
                        error={row.touched && !row.quantity}
                        errorMessage='Quantity is required'
                        className='w-[240px]'
                      />
                    </div>

                    {/* Expiration date */}
                    <div className='relative'>
                      <label className='block text-[11px] font-semibold uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
                        Expiration date (optional)
                      </label>
                      <div
                        onClick={() =>
                          updateRow(row.id, { calendarOpen: !row.calendarOpen })
                        }
                        className='flex items-center px-4 py-3 bg-white border border-[#d7d8e0] rounded-[4px] cursor-pointer text-[14px] text-[#19191c]'
                        style={{ width: '240px', height: '48px' }}
                      >
                        {row.date ? format(row.date, 'd MMM yyyy') : 'Select'}
                      </div>
                      {row.calendarOpen && (
                        <ExpiryDatePicker
                          selected={row.date}
                          onChange={(date) =>
                            updateRow(row.id, { date, calendarOpen: false })
                          }
                          onClose={() =>
                            updateRow(row.id, { calendarOpen: false })
                          }
                        />
                      )}
                    </div>

                    {/* Clear / Remove */}
                    <div className='mt-[35px]'>
                      {index === 0 ? (
                        <button
                          onClick={() => updateRow(row.id, { date: null })}
                          className='text-[14px] font-semibold text-[#23a956] bg-transparent border-none cursor-pointer p-0'
                        >
                          Clear expiration date
                        </button>
                      ) : (
                        <button
                          onClick={() => removeRow(row.id)}
                          className='text-[14px] font-semibold text-[#23a956] bg-transparent border-none cursor-pointer p-0'
                        >
                          Remove this expiration date
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add row */}
              <button
                onClick={addRow}
                className='text-[14px] font-semibold text-[#23a956] bg-transparent border-none cursor-pointer p-0 text-left w-fit mt-2'
              >
                + Add another expiration date
              </button>
            </div>
          </div>
          <hr className='my-12 border-t border-black/10' />

          {/* Total product cost section */}
          <div>
            <h3 className='text-[20px] font-semibold leading-7 tracking-[-0.01em] text-[#19191c] m-0 mb-2'>
              Total product cost
            </h3>
            <div className='mt-12 flex items-center gap-12'>
              <div>
                <label className='block text-[11px] font-semibold uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
                  Total product cost*
                </label>

                <FormInput
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
                  onBlur={() => setTouchedCost(true)}
                  placeholder='e.g. 100,00 kr'
                  error={touchedCost && !totalCost}
                  errorMessage='This field is required'
                  className='w-[288px]'
                />

                <span
                  className='block text-[13px] font-normal leading-4 text-[#6b6b6f] mt-2'
                  style={{ width: '288px' }}
                >
                  Specify how much you paid for this product in total
                </span>
              </div>

              <div className='text-[14px] font-normal leading-5 text-[#6b6b6f]'>
                {(() => {
                  const totalQuantity = rows.reduce(
                    (sum, r) => sum + (parseFloat(r.quantity) || 0),
                    0,
                  );
                  const costPerUnit =
                    totalQuantity > 0 && totalCost !== ''
                      ? (parseFloat(totalCost) / totalQuantity).toFixed(1)
                      : '0.0';
                  return `= ${formatPrice(costPerUnit)} per ${unitName || 'unit'} / ${formatPrice(costPerUnit)} per ${unitName || 'unit'}`;
                })()}
              </div>
            </div>
          </div>
          <hr className='my-12 border-t border-black/10' />
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between shrink-0 px-12 py-[14px] border-t border-[#e7e7ec]'>
          <WhiteButton onClick={onClose}>Cancel</WhiteButton>

          <GreenButton onClick={trySave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </GreenButton>
        </div>
      </div>
    </div>
  );
}
