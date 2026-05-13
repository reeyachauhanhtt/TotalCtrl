import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FiX } from 'react-icons/fi';

import { fetchInventory } from '../../services/inventoryService';
import { fetchSuppliers } from '../../services/supplierService';
import { setSelectedInventory } from '../../store/inventorySlice';
import { fetchMeasurementUnits } from '../../services/masterDataService';
import { createOrder } from '../../services/externalOrderService';
import SupplierSearchDropdown from '../ExternalOrder/SupplierSearchDropdown';
import TransferInventoryDropdown from '../Inventory/TransferInvDropdown';
import OrderItemsTable, { emptyRow } from '../Common/OrderItemTable';
import GreenButton from '../Common/GreenButton';
import WhiteButton from '../Common/WhiteButton';
import DateFields, { emptyDate, emptyDateErrors } from '../Common/DateFields';
import {
  validateOrderDates,
  isOrderDatesValid,
} from '../../utils/orderDateValidation';

export default function AddOrderManuallyModal({ isOpen, onClose, onError }) {
  const dispatch = useDispatch();
  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);

  const [step, setStep] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [invDropdownOpen, setInvDropdownOpen] = useState(false);
  const [rows, setRows] = useState([emptyRow()]);
  const [supplierError, setSupplierError] = useState(false);
  const [hasReachedStep3, setHasReachedStep3] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [orderedOn, setOrderedOn] = useState(emptyDate());
  const [scheduledFor, setScheduledFor] = useState(emptyDate());
  const [showFooterError, setShowFooterError] = useState(false);
  const [dateErrors, setDateErrors] = useState({
    orderedOn: emptyDateErrors(),
    scheduledFor: emptyDateErrors(),
  });

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['inventories'],
    queryFn: fetchInventory,
  });

  const { data: suppliersData = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const { data: unitData } = useQuery({
    queryKey: ['measurementUnits'],
    queryFn: fetchMeasurementUnits,
    staleTime: 0,
  });

  const inventories = data?.Data || data?.data || [];
  const editorInventories = inventories.filter(
    (inv) =>
      inv.permission?.toLowerCase() === 'editor' ||
      inv.permission?.toLowerCase() === 'owner',
  );

  const units =
    unitData?.purchaseUnit?.length > 0
      ? unitData.purchaseUnit.map((u) => ({
          label: u.name,
          value: u.name,
          id: u.id,
        }))
      : [];

  function handleClose() {
    setStep(1);
    setHasReachedStep3(false);
    setOrderNumber('');
    setSelectedSupplier(null);
    setRows([emptyRow()]);
    setSupplierError(false);
    setShowFooterError(false);
    setOrderedOn(emptyDate());
    setScheduledFor(emptyDate());
    setDateErrors({
      orderedOn: emptyDateErrors(),
      scheduledFor: emptyDateErrors(),
    });
    onClose();
  }
  if (!isOpen) return null;

  return (
    <div
      className='flex items-center fixed z-1000 left-0 top-0 w-full h-full'
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div
        className='flex flex-col bg-white rounded-lg shadow-md mx-auto'
        style={{ width: '75%', height: 'calc(100% - 48px)' }}
      >
        {/* Header */}
        <div className='shrink-0 flex items-center justify-between border-b border-[#e7e7ec] rounded-t px-7.25 pl-12 py-6'>
          <h2 className='text-[18px] leading-6 font-semibold text-[#19191c] mb-0 tracking-[-0.01em] flex items-center gap-4'>
            Add order manually
            <span className='text-[18px] leading-6 font-semibold text-[#19191c]'>
              Step {step}/3
            </span>
          </h2>
          <span className='cursor-pointer' onClick={handleClose}>
            <FiX size={22} color='#19191c' />
          </span>
        </div>

        {/* Body */}
        <div className='flex-1 text-[16px] leading-6 text-[#737373] pt-12 pb-6 overflow-y-auto'>
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className='ml-12'>
                <h2 className='text-[24px] leading-8 font-semibold tracking-[-0.01em] text-[#19191c] text-left mb-3'>
                  Select Inventory
                </h2>
                <p className='text-[#6b6b6f] text-[14.5px] font-normal leading-6 mb-0'>
                  Which inventory should we update when this order is delivered?
                </p>
              </div>

              <div className='mt-9 mb-5 ml-12'>
                <TransferInventoryDropdown
                  label='Inventory'
                  value={selectedInventory}
                  placeholder='Select Inventory'
                  inventories={editorInventories}
                  isOpen={invDropdownOpen}
                  setOpen={setInvDropdownOpen}
                  onSelect={(inv) => dispatch(setSelectedInventory(inv))}
                />
              </div>

              <div className='mx-12'>
                <p className='text-[#6b6b6f] text-[14.5px] w-132.5 font-normal leading-6'>
                  When you import the order, it will also appear in the
                  TotalCtrl Inventory mobile app, so that you and your
                  colleagues can easily check off the ordered items on delivery.
                  The quantity of products you check off will be automatically
                  updated in the selected inventory.
                </p>
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className='ml-12'>
                <h2 className='text-[24px] leading-8 font-semibold tracking-[-0.01em] text-[#19191c] text-left mb-6'>
                  Order details
                </h2>
              </div>

              <div className='ml-12'>
                {/* Row 1 — Supplier + Order Number */}
                <div className='flex items-start'>
                  <div
                    className='mb-7'
                    style={{ width: '340px', marginRight: '64px' }}
                  >
                    <label className='block font-semibold text-[11px] leading-4 uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
                      Supplier name*
                    </label>
                    <SupplierSearchDropdown
                      suppliers={suppliersData}
                      selectedSupplier={selectedSupplier}
                      onSelect={(s) => {
                        setSelectedSupplier(s);
                        setSupplierError(false);
                      }}
                      supplierError={supplierError}
                      onBlur={() => {
                        if (!selectedSupplier) setSupplierError(true);
                      }}
                      className='w-85!'
                    />
                  </div>

                  <div className='mb-7' style={{ width: '340px' }}>
                    <label className='block font-semibold text-[11px] leading-4 uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
                      Order number
                    </label>
                    <input
                      type='text'
                      placeholder='Enter Order number'
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      className='border border-[#d7d8e0] rounded px-4 py-3 w-full text-[13px] leading-6 text-[#333] outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600'
                    />
                  </div>
                </div>

                {/* Row 2 — Ordered on + Scheduled for */}
                <div className='flex items-start'>
                  <div style={{ marginRight: '64px' }}>
                    <DateFields
                      label='Ordered on'
                      value={orderedOn}
                      onChange={(val) => setOrderedOn(val)}
                      errors={dateErrors.orderedOn}
                      onFieldBlur={(field, msg) =>
                        setDateErrors((prev) => ({
                          ...prev,
                          orderedOn: { ...prev.orderedOn, [field]: msg },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <DateFields
                      label='Scheduled for'
                      value={scheduledFor}
                      onChange={(val) => setScheduledFor(val)}
                      errors={dateErrors.scheduledFor}
                      onFieldBlur={(field, msg) =>
                        setDateErrors((prev) => ({
                          ...prev,
                          scheduledFor: { ...prev.scheduledFor, [field]: msg },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div style={{ paddingRight: 0, paddingTop: 0 }}>
              <div style={{ marginLeft: 48, marginTop: 10 }}>
                <h2
                  className='font-semibold tracking-[-0.01em] text-[#19191c] text-left'
                  style={{ fontSize: 24, lineHeight: '32px', marginBottom: 24 }}
                >
                  Ordered items
                </h2>
              </div>

              <div style={{ width: '100%', margin: '0' }}>
                <OrderItemsTable
                  rows={rows}
                  onChange={setRows}
                  units={units}
                  mode='order'
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='shrink-0 border-t border-[#e7e7ec] px-12 py-3.5 flex justify-between items-center'>
          <WhiteButton onClick={handleClose}>Cancel</WhiteButton>

          {showFooterError && (
            <div className='w-[60%] bg-[#fff0f1] text-[#a71a23] font-semibold text-[14px] leading-4.5 rounded px-3 py-2 flex items-center'>
              <img src='/icons/error.svg' className='w-5 ml-2 mr-2' />
              <span className='ml-2'>
                Fill in all the required fields before you continue
              </span>
            </div>
          )}

          <div className='flex items-center gap-3'>
            {step > 1 && (
              <WhiteButton
                onClick={() => {
                  if (step === 2 && !hasReachedStep3) {
                    setSelectedSupplier(null);
                    setOrderNumber('');
                    setOrderedOn(emptyDate());
                    setScheduledFor(emptyDate());
                    setDateErrors({
                      orderedOn: emptyDateErrors(),
                      scheduledFor: emptyDateErrors(),
                    });
                    setSupplierError(false);
                    setShowFooterError(false);
                  }
                  setStep((s) => s - 1);
                }}
                className='mr-6'
              >
                Previous step
              </WhiteButton>
            )}

            <GreenButton
              disabled={isSaving}
              onClick={async () => {
                // STEP 1 → no validation
                if (step === 1) {
                  setStep(2);
                  return;
                }

                // STEP 2 → validation required
                if (step === 2) {
                  let hasError = false;

                  if (!selectedSupplier) {
                    setSupplierError(true);
                    hasError = true;
                  } else {
                    setSupplierError(false);
                  }

                  const result = validateOrderDates({
                    orderedOn,
                    scheduledFor,
                  });
                  if (!isOrderDatesValid(result)) {
                    setDateErrors(result);
                    hasError = true;
                  } else {
                    setDateErrors({
                      orderedOn: emptyDateErrors(),
                      scheduledFor: emptyDateErrors(),
                    });
                  }

                  setShowFooterError(hasError);

                  if (!hasError) {
                    if (!hasReachedStep3) setHasReachedStep3(true);
                    setStep(3);
                  }
                  return;
                }

                // STEP 3 → save
                if (step === 3) {
                  const filledRows = rows.filter(
                    (r) => r.name || r.quantity || r.unit || r.price,
                  );
                  const hasInvalid =
                    filledRows.length === 0 ||
                    filledRows.some(
                      (r) => !r.name || !r.quantity || !r.unit || !r.price,
                    );

                  if (hasInvalid) {
                    setRows((prev) =>
                      prev.map((r) => ({ ...r, touched: true })),
                    );
                    setShowFooterError(true);
                    return;
                  }

                  // Frontend guard — catch missing order number before API call
                  if (!orderNumber.trim()) {
                    handleClose();
                    setTimeout(
                      () => onError?.('Number should not be empty'),
                      50,
                    );
                    return;
                  }

                  const orderedDate = `${orderedOn.year}-${String(orderedOn.month).padStart(2, '0')}-${String(orderedOn.day).padStart(2, '0')}`;
                  const scheduledDate = `${scheduledFor.year}-${String(scheduledFor.month).padStart(2, '0')}-${String(scheduledFor.day).padStart(2, '0')}`;

                  const payload = {
                    number: orderNumber,
                    requestDate: orderedDate,
                    deliveryDate: scheduledDate,
                    receivedDate: null,
                    inventoryId: selectedInventory?.id,
                    supplierId: selectedSupplier?.Id,
                    currency: null,
                    total: rows.reduce(
                      (sum, r) => sum + (parseFloat(r.total) || 0),
                      0,
                    ),
                    source: 0,
                    products: rows
                      .filter((r) => r.name && r.quantity)
                      .map((r) => ({
                        id: null,
                        name: r.name,
                        sku: r.sku ?? '',
                        brand: '',
                        orderQuantity: parseFloat(r.quantity) || 0,
                        acceptedQuantity: parseFloat(r.quantity) || 0,
                        pricePerPurchaseUnit: parseFloat(r.price) || 0,
                        pricePerStockTakingUnit: 0,
                        pricePerBaseUnit: 0,
                        subtotal: String(parseFloat(r.total || 0).toFixed(2)),
                        purchaseUnitId: r.unitId || null,
                        stockTakingUnitId: r.unitId || null,
                        baseUnitId: null,
                        stockTakingQuantityPerPurchaseUnit: 1,
                        taxRate: '0',
                        vatRate: '',
                        notes: '',
                        checked: 0,
                        quantityIssueId: null,
                        qualityIssueId: null,
                      })),
                  };

                  try {
                    setIsSaving(true);
                    await createOrder(payload);
                    queryClient.invalidateQueries({
                      queryKey: ['external-orders'],
                    });
                    handleClose();
                  } catch (err) {
                    const msg =
                      err?.response?.data?.Message ||
                      'Failed to save order. Please try again.';
                    handleClose();
                    setTimeout(() => onError?.(msg), 50);
                  } finally {
                    setIsSaving(false);
                  }
                  return;
                }
              }}
            >
              {step === 3 ? (isSaving ? 'Saving...' : 'Save') : 'Continue'}
            </GreenButton>
          </div>
        </div>
      </div>
    </div>
  );
}
