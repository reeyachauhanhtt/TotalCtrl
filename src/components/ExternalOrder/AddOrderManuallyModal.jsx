import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { FiX } from 'react-icons/fi';

import { fetchInventory } from '../../services/inventoryService';
import { fetchSuppliers } from '../../services/supplierService';
import { setSelectedInventory } from '../../store/inventorySlice';
import { fetchMeasurementUnits } from '../../services/masterDataService';
import SupplierSearchDropdown from '../ExternalOrder/SupplierSearchDropdown';
import TransferInventoryDropdown from '../Inventory/TransferInvDropdown';
import OrderItemsTable from '../Common/OrderItemTable';
import GreenButton from '../Common/GreenButton';
import WhiteButton from '../Common/WhiteButton';
import {
  validateOrderDates,
  isOrderDatesValid,
} from '../../utils/orderDateValidation';

// ─── DateFields ────────────────────────────────────────────────────────────────

function DateFields({ label, value, onChange, errors = {} }) {
  // value: { day: '', month: '', year: '' }
  // errors: { day?: string, month?: string, year?: string }

  function handleChange(field, raw) {
    onChange({ ...value, [field]: raw });
  }

  return (
    <div>
      <label className='block font-semibold text-[18px] leading-6 tracking-[-0.01em] text-[#19191c] mb-3'>
        {label}
      </label>
      <div className='flex items-start gap-4'>
        {/* Day */}
        <div className='mb-7'>
          <label className='block font-semibold text-[11px] leading-4 uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
            Day*
          </label>
          <input
            type='number'
            placeholder='dd'
            min={1}
            max={31}
            value={value.day}
            onChange={(e) => handleChange('day', e.target.value)}
            className={[
              'border rounded px-4 py-3 text-[14px] leading-6 text-[#333] outline-none',
              errors.day
                ? 'bg-[#fff7f7] border-[#fc5c63] shadow-[0_0_0_1px_#fc5c63]'
                : 'border-[#d7d8e0]',
            ].join(' ')}
            style={{ width: '70px' }}
          />
          {errors.day && (
            <p className='mt-1 text-[11px] text-[#fc5c63] font-medium leading-4'>
              {errors.day}
            </p>
          )}
        </div>

        {/* Month */}
        <div className='mb-7'>
          <label className='block font-semibold text-[11px] leading-4 uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
            Month*
          </label>
          <input
            type='number'
            placeholder='mm'
            min={1}
            max={12}
            value={value.month}
            onChange={(e) => handleChange('month', e.target.value)}
            className={[
              'border rounded px-4 py-3 text-[14px] leading-6 text-[#333] outline-none',
              errors.month
                ? 'bg-[#fff7f7] border-[#fc5c63] shadow-[0_0_0_1px_#fc5c63]'
                : 'border-[#d7d8e0]',
            ].join(' ')}
            style={{ width: '72px' }}
          />
          {errors.month && (
            <p className='mt-1 text-[11px] text-[#fc5c63] font-medium leading-4'>
              {errors.month}
            </p>
          )}
        </div>

        {/* Year */}
        <div className='mb-7'>
          <label className='block font-semibold text-[11px] leading-4 uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
            Year*
          </label>
          <input
            type='number'
            placeholder='yyyy'
            min={1900}
            value={value.year}
            onChange={(e) => handleChange('year', e.target.value)}
            className={[
              'border rounded px-4 py-3 text-[14px] leading-6 text-[#333] outline-none',
              errors.year
                ? 'bg-[#fff7f7] border-[#fc5c63] shadow-[0_0_0_1px_#fc5c63]'
                : 'border-[#d7d8e0]',
            ].join(' ')}
            style={{ width: '166px' }}
          />
          {errors.year && (
            <p className='mt-1 text-[11px] text-[#fc5c63] font-medium leading-4'>
              {errors.year}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Empty date state helper ───────────────────────────────────────────────────

const emptyDate = () => ({ day: '', month: '', year: '' });
const emptyDateErrors = () => ({
  day: undefined,
  month: undefined,
  year: undefined,
});

// ─── AddOrderManuallyModal ─────────────────────────────────────────────────────

export default function AddOrderManuallyModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);

  const [step, setStep] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [invDropdownOpen, setInvDropdownOpen] = useState(false);
  const [rows, setRows] = useState([
    { item: null, quantity: '', unit: null, price: '', total: 0 },
  ]);
  const [supplierError, setSupplierError] = useState(false);

  // Date field values
  const [orderedOn, setOrderedOn] = useState(emptyDate());
  const [scheduledFor, setScheduledFor] = useState(emptyDate());
  const [showFooterError, setShowFooterError] = useState(false);

  // Date field errors
  const [dateErrors, setDateErrors] = useState({
    orderedOn: emptyDateErrors(),
    scheduledFor: emptyDateErrors(),
  });

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
    setOrderedOn(emptyDate());
    setScheduledFor(emptyDate());
    setDateErrors({
      orderedOn: emptyDateErrors(),
      scheduledFor: emptyDateErrors(),
    });
    onClose();
  }

  function handleContinue() {
    if (step === 2) {
      // Run validation before moving to step 3
      const result = validateOrderDates({ orderedOn, scheduledFor });
      if (!isOrderDatesValid(result)) {
        setDateErrors(result);
        return; // block navigation
      }
      // Clear errors on success
      setDateErrors({
        orderedOn: emptyDateErrors(),
        scheduledFor: emptyDateErrors(),
      });
    }

    if (step < 3) setStep((s) => s + 1);
  }

  if (!isOpen) return null;

  function handleRowChange(id, updated) {
    setRows((prev) => prev.map((r) => (r.id === id ? updated : r)));
  }

  function handleDeleteRow(id) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function handleAddRow() {
    setRows((prev) => [...prev, emptyRow()]);
  }

  return (
    <div
      className='flex items-center fixed z-1000 left-0 top-0 w-full h-full'
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
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
                      onSelect={setSelectedSupplier}
                      supplierError={supplierError}
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
                      className='border border-[#d7d8e0] rounded px-4 py-3 w-full text-[14px] leading-6 text-[#333] outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600'
                    />
                  </div>
                </div>

                {/* Row 2 — Ordered on + Scheduled for */}
                <div className='flex items-start'>
                  <div style={{ marginRight: '64px' }}>
                    <DateFields
                      label='Ordered on'
                      value={orderedOn}
                      onChange={(val) => {
                        setOrderedOn(val);
                        // Clear individual field error as user types
                        setDateErrors((prev) => ({
                          ...prev,
                          orderedOn: { ...prev.orderedOn },
                        }));
                      }}
                      errors={dateErrors.orderedOn}
                    />
                  </div>
                  <div>
                    <DateFields
                      label='Scheduled for'
                      value={scheduledFor}
                      onChange={(val) => {
                        setScheduledFor(val);
                        setDateErrors((prev) => ({
                          ...prev,
                          scheduledFor: { ...prev.scheduledFor },
                        }));
                      }}
                      errors={dateErrors.scheduledFor}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <div style={{ paddingRight: 0, paddingTop: 0 }}>
              {/* Title — dev: margin-left:48px, margin-top:48px */}
              <div style={{ marginLeft: 48, marginTop: 48 }}>
                <h2
                  className='font-semibold tracking-[-0.01em] text-[#19191c] text-left'
                  style={{ fontSize: 24, lineHeight: '32px', marginBottom: 24 }}
                >
                  Ordered items
                </h2>
              </div>

              {/* Table container — dev: width:95%, margin:auto */}
              <div style={{ width: '95%', margin: '0 auto' }}>
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
                onClick={() => setStep((s) => s - 1)}
                className='mr-6'
              >
                Previous step
              </WhiteButton>
            )}

            <GreenButton
              onClick={() => {
                // STEP 1 → no validation
                if (step === 1) {
                  setStep(2);
                  return;
                }

                // STEP 2 → validation required
                if (step === 2) {
                  let hasError = false;

                  // Supplier validation
                  if (!selectedSupplier) {
                    setSupplierError(true);
                    hasError = true;
                  } else {
                    setSupplierError(false);
                  }

                  // Date validation
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
                    setStep(3);
                  }

                  return;
                }

                // STEP 3 fallback (if needed)
                if (step < 3) {
                  setStep((s) => s + 1);
                }
              }}
            >
              {step === 3 ? 'Save' : 'Continue'}
            </GreenButton>
          </div>
        </div>
      </div>
    </div>
  );
}
