import { useState, useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';

import { formatNumber } from '../../utils/format';
import { SkeletonBar } from '../Common/Skeleton';
import GreenButton from '../Common/GreenButton';
import WhiteButton from '../Common/WhiteButton';
import ConfirmModal from '../Common/ConfirmModal';
import UnitDropdown from '../Common/UnitDropdown';
import SupplierSearchDropdown from '../ExternalOrder/SupplierSearchDropdown';
import { searchProducts } from '../../services/productService';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function DateInput({
  label,
  day,
  month,
  year,
  onDayChange,
  onMonthChange,
  onYearChange,
  hasError,
  onDayBlur,
  onMonthBlur,
  onYearBlur,
}) {
  const [monthOpen, setMonthOpen] = useState(false);

  const monthRef = useRef(null);

  const inputErrClass = 'border-2 border-[#e2232e] bg-[#fff0f1] text-[#a71a23]';
  const inputNormalClass =
    'border border-[#d7d8e0] text-[#333] focus:border-green-600 focus:ring-1 focus:ring-green-600';
  const dayClass = `w-22 rounded-sm px-3 py-3 text-[14px] leading-6 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${hasError ? inputErrClass : inputNormalClass}`;
  const monthTriggerClass = `flex items-center justify-between h-12.5 w-full rounded-[3px] bg-white px-5 cursor-pointer ${hasError ? 'border-2 border-[#e2232e] bg-[#fff0f1]' : 'border border-[#d7d7db]'}`;
  const yearClass = `w-25 rounded-sm px-3 py-3 text-[14px] leading-6 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  ${hasError ? inputErrClass : inputNormalClass}`;

  //months dropdown closing on backdrop click

  useEffect(() => {
    if (!monthOpen) return;
    function handleClickOutside(e) {
      if (monthRef.current && !monthRef.current.contains(e.target)) {
        setMonthOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside); // 👈 'click' not 'mousedown'
    return () => document.removeEventListener('click', handleClickOutside);
  }, [monthOpen]);

  return (
    <div className='mb-7'>
      <label className='block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6f] mb-1'>
        {label}
      </label>
      <div className='flex items-center gap-3'>
        {/* Day */}
        <input
          type='number'
          placeholder='Day'
          value={day}
          onChange={(e) => onDayChange(e.target.value)}
          onBlur={onDayBlur}
          className={`w-22 rounded-sm px-3 py-3 text-[14px] leading-6 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${hasError ? inputErrClass : inputNormalClass}`}
        />

        {/* Month dropdown */}
        <div className='relative flex-1 min-w-32.5' ref={monthRef}>
          <div
            onClick={() => setMonthOpen((p) => !p)}
            className={`flex items-center justify-between h-12.5 w-full rounded-[3px] px-5 cursor-pointer ${hasError ? 'border-2 border-[#e2232e] bg-[#fff0f1]' : 'border border-[#d7d7db]'}`}
          >
            <span
              className={`text-[14px] ${hasError ? 'text-[#a71a23]' : 'text-[#19191c]'}`}
            >
              {month || 'Month'}
            </span>
            <img
              src='/icons/chevron-down-small.svg'
              alt=''
              className='w-6 h-6'
            />
          </div>

          {/* dropdown directly here, no extra wrapper */}
          {monthOpen && (
            <div className='absolute top-full mt-2 w-full bg-white border border-[#d7d7db] rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.12)] z-50 max-h-53.75 overflow-y-auto'>
              {MONTHS.map((m) => (
                <div
                  key={m}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMonthChange(m);
                    setMonthOpen(false);
                  }}
                  className={`flex justify-between items-center px-5 py-2 text-[14px] text-[#19191c] cursor-pointer hover:bg-gray-100 ${month === m ? 'bg-[#eaf7ee]' : ''}`}
                >
                  {m}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Year */}
        <input
          type='number'
          placeholder='Year'
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          onBlur={onYearBlur}
          className={`w-25 rounded-sm px-3 py-3 text-[14px] leading-6 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${hasError ? inputErrClass : inputNormalClass}`}
        />
      </div>
    </div>
  );
}

export default function EditOrderModal({
  open,
  onClose,
  order,
  inventories = [],
  suppliers = [],
  units = [],
  onSave,
}) {
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [supplierError, setSupplierError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [itemErrors, setItemErrors] = useState({});
  const [itemsLoading, setItemsLoading] = useState(false);
  const [orderNumberError, setOrderNumberError] = useState(false);

  const [orderedDateError, setOrderedDateError] = useState(false);
  const [scheduledDateError, setScheduledDateError] = useState(false);

  const [focusedPriceIndex, setFocusedPriceIndex] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [searchingIndex, setSearchingIndex] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Ordered on
  const [orderedDay, setOrderedDay] = useState('');
  const [orderedMonth, setOrderedMonth] = useState('');
  const [orderedYear, setOrderedYear] = useState('');

  // Scheduled for
  const [scheduledDay, setScheduledDay] = useState('');
  const [scheduledMonth, setScheduledMonth] = useState('');
  const [scheduledYear, setScheduledYear] = useState('');

  const [items, setItems] = useState([]);

  const searchTimerRef = useRef(null);
  const nameInputRefs = useRef({});
  const inventoryRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (inventoryRef.current && !inventoryRef.current.contains(e.target)) {
        setInventoryOpen(false);
      }
    }
    if (inventoryOpen)
      document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [inventoryOpen]);

  // Prefill from order prop
  useEffect(() => {
    if (!open || !order) return;

    setItemsLoading(true);
    setItems([]);

    setOrderNumber(order.number ?? '');
    setSelectedInventory(
      inventories.find((i) => i.name === order.inventoryName) ?? null,
    );
    setSelectedSupplier(
      suppliers.find((s) => s.Name === order.supplier) ?? {
        Name: order.supplier,
      },
    );

    if (order.placedDate) {
      const d = new Date(order.placedDate);
      setOrderedDay(String(d.getDate()).padStart(2, '0'));
      setOrderedMonth(MONTHS[d.getMonth()]);
      setOrderedYear(String(d.getFullYear()));
    }
    if (order.scheduledDate) {
      const d = new Date(order.scheduledDate);
      setScheduledDay(String(d.getDate()).padStart(2, '0'));
      setScheduledMonth(MONTHS[d.getMonth()]);
      setScheduledYear(String(d.getFullYear()));
    }

    setItems(order.products ?? []);
    setItemErrors({});

    setTimeout(() => {
      setItems(order.products ?? []);
      setItemsLoading(false);
    }, 600);
  }, [open, order]);

  const hasItemErrors = items.some(
    (item) =>
      !item.orderQuantity ||
      Number(item.orderQuantity) <= 0 ||
      !item.pricePerPurchaseUnit ||
      Number(item.pricePerPurchaseUnit) <= 0,
  );

  const isDirty =
    orderNumber !== (order?.number ?? '') ||
    selectedSupplier?.Name !== (order?.supplier ?? '') ||
    selectedInventory?.id !==
      (inventories.find((i) => i.name === order?.inventoryName)?.id ?? null) ||
    orderedDay !==
      (order?.placedDate
        ? String(new Date(order.placedDate).getDate()).padStart(2, '0')
        : '') ||
    orderedMonth !==
      (order?.placedDate
        ? MONTHS[new Date(order.placedDate).getMonth()]
        : '') ||
    orderedYear !==
      (order?.placedDate
        ? String(new Date(order.placedDate).getFullYear())
        : '') ||
    scheduledDay !==
      (order?.scheduledDate
        ? String(new Date(order.scheduledDate).getDate()).padStart(2, '0')
        : '') ||
    scheduledMonth !==
      (order?.scheduledDate
        ? MONTHS[new Date(order.scheduledDate).getMonth()]
        : '') ||
    scheduledYear !==
      (order?.scheduledDate
        ? String(new Date(order.scheduledDate).getFullYear())
        : '') ||
    JSON.stringify(items) !== JSON.stringify(order?.products ?? []);

  const isValid =
    selectedSupplier &&
    orderNumber &&
    orderedDay &&
    orderedMonth &&
    orderedYear &&
    scheduledDay &&
    scheduledMonth &&
    scheduledYear;

  function handleItemChange(index, field, value) {
    let updatedItem = null;

    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: value };
        if (field === 'orderQuantity' || field === 'pricePerPurchaseUnit') {
          const qty =
            parseFloat(
              field === 'orderQuantity' ? value : updated.orderQuantity,
            ) || 0;
          const price =
            parseFloat(
              field === 'pricePerPurchaseUnit'
                ? value
                : updated.pricePerPurchaseUnit,
            ) || 0;
          updated.subtotal = qty && price ? (qty * price).toFixed(2) : '';
        }
        updatedItem = updated;
        return updated;
      }),
    );

    // now updatedItem is accessible here
    if (field === 'orderQuantity' || field === 'pricePerPurchaseUnit') {
      const qtyInvalid =
        field === 'orderQuantity'
          ? !value || Number(String(value).replace(',', '.')) <= 0
          : !updatedItem?.orderQuantity ||
            Number(String(updatedItem?.orderQuantity).replace(',', '.')) <= 0;

      const priceInvalid =
        field === 'pricePerPurchaseUnit'
          ? !value || Number(String(value).replace(',', '.')) <= 0
          : !updatedItem?.pricePerPurchaseUnit ||
            Number(
              String(updatedItem?.pricePerPurchaseUnit).replace(',', '.'),
            ) <= 0;

      const prevQtyErr = itemErrors[index]?.orderQuantity ?? false;
      const prevPriceErr = itemErrors[index]?.pricePerPurchaseUnit ?? false;

      setItemErrors((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          orderQuantity: field === 'orderQuantity' ? qtyInvalid : prevQtyErr,
          pricePerPurchaseUnit:
            field === 'pricePerPurchaseUnit' ? priceInvalid : prevPriceErr,
          subtotal:
            (field === 'orderQuantity' ? qtyInvalid : prevQtyErr) ||
            (field === 'pricePerPurchaseUnit' ? priceInvalid : prevPriceErr),
        },
      }));
    }
  }

  function handleDeleteItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAddItemBelow(index) {
    setItems((prev) => [
      ...prev.slice(0, index + 1),
      {
        id: Date.now(),
        name: '',
        sku: '',
        orderQuantity: '',
        purchaseUnit: '',
        pricePerPurchaseUnit: '',
        subtotal: '',
      },
      ...prev.slice(index + 1),
    ]);
  }

  function handleSave() {
    let hasError = false;

    if (!selectedSupplier) {
      setSupplierError(true);
      hasError = true;
    }
    if (!orderNumber) {
      setOrderNumberError(true);
      hasError = true;
    }
    if (!orderedDay || !orderedMonth || !orderedYear) {
      setOrderedDateError(true);
      hasError = true;
    }
    if (!scheduledDay || !scheduledMonth || !scheduledYear) {
      setScheduledDateError(true);
      hasError = true;
    }

    // validate items
    const newItemErrors = {};
    items.forEach((item, index) => {
      const qtyInvalid =
        !item.orderQuantity ||
        Number(String(item.orderQuantity).replace(',', '.')) <= 0;

      const priceInvalid =
        !item.pricePerPurchaseUnit || Number(item.pricePerPurchaseUnit) <= 0;

      if (qtyInvalid || priceInvalid) {
        newItemErrors[index] = {
          orderQuantity: qtyInvalid,
          pricePerPurchaseUnit: priceInvalid,
          subtotal: qtyInvalid || priceInvalid,
        };
        hasError = true;
      }
    });
    setItemErrors(newItemErrors);

    if (hasError) {
      setShowError(true);
      return;
    }
    setShowError(false);

    onSave?.({
      inventoryId: selectedInventory?.id,
      supplier: selectedSupplier?.Name,
      orderNumber,
      orderedOn: `${orderedYear}-${String(MONTHS.indexOf(orderedMonth) + 1).padStart(2, '0')}-${orderedDay}`,
      scheduledFor: `${scheduledYear}-${String(MONTHS.indexOf(scheduledMonth) + 1).padStart(2, '0')}-${scheduledDay}`,
      items,
    });
  }

  const errHighlight = (msg) => (
    <div
      style={{
        display: 'block',
        fontWeight: 600,
        paddingTop: '8px',
        padding: '11px',
        background: '#fff0f1',
        color: '#a71a23',
        borderRadius: '4px',
        fontSize: '14px',
        lineHeight: '20px',
        marginTop: '8px',
      }}
    >
      {msg}
    </div>
  );

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='bg-white rounded-lg shadow-[0_4px_4px_rgba(0,0,0,0.12)] w-[75%] h-[calc(100%-48px)] flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between px-12 py-6 border-b border-[#e7e7ec]'>
          <h2 className='text-[18px] font-semibold leading-6 tracking-[-0.01em] text-[#19191c] m-0'>
            Edit scheduled order
          </h2>
          <span
            onClick={() => (isDirty ? setShowDiscardModal(true) : onClose())}
            className='cursor-pointer text-gray-700'
          >
            <FiX size={20} strokeWidth={2.5} />
          </span>
        </div>

        {/* Body — scrollable */}
        <div className='flex-1 overflow-y-auto'>
          <div className='px-12 pt-12 pb-6'>
            {/* Order summary heading */}
            <div className='pb-17.5'>
              <h1 className='text-[24px] font-semibold leading-8 tracking-[-0.01em] text-[#19191c] text-left m-0'>
                Order summary
              </h1>
            </div>

            {/* Inventory section */}
            <div className='flex items-end gap-6 mb-12.5'>
              <div className='w-1/3'>
                <h2 className='text-[24px] font-semibold leading-8 tracking-[-0.01em] text-[#19191c] text-left mb-3'>
                  Inventory
                </h2>
                <p className='text-[14.5px] font-normal leading-6 text-[#6b6b6f] mb-4'>
                  Which inventory should be automatically updated when this
                  order is delivered?
                </p>

                {/* Inventory dropdown */}
                <div>
                  <label className='block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6f] mb-1'>
                    Inventory
                  </label>
                  <div className='relative' ref={inventoryRef}>
                    {/* Trigger */}
                    <div
                      onClick={() => setInventoryOpen((p) => !p)}
                      className='flex items-center justify-between h-12 w-100 border border-[#d7d7db] rounded-[3px] bg-white px-5 cursor-pointer'
                    >
                      <span className='text-[14px] text-[#19191c]'>
                        {selectedInventory?.name ?? 'Select inventory'}
                      </span>
                      <img
                        src='/icons/chevron-down-small.svg'
                        alt=''
                        className='w-6 h-6'
                      />
                    </div>

                    {/* Dropdown list */}
                    {inventoryOpen && (
                      <ul
                        className='absolute w-100 bg-white border border-[#d7d7db] rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.12)] z-50 overflow-y-scroll p-0 m-0 list-none'
                        style={{
                          maxHeight: '215px',
                          marginTop: '8px',
                          padding: '15px 0',
                        }}
                      >
                        {inventories.map((inv) => {
                          const isSelected = selectedInventory?.id === inv.id;
                          return (
                            <li
                              key={inv.id}
                              onClick={() => {
                                setSelectedInventory(inv);
                                setInventoryOpen(false);
                              }}
                              className='w-full cursor-pointer'
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '20px',
                                color: '#19191c',
                                padding: '8px 20px',
                                backgroundColor: isSelected
                                  ? '#eaf7ee'
                                  : 'transparent',
                                whiteSpace: 'break-spaces',
                              }}
                            >
                              <span>{inv.name}</span>
                              {isSelected && (
                                <img
                                  src='/icons/check-small.svg'
                                  alt=''
                                  className='w-6 h-6'
                                />
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Info box */}
              <div className='w-2/3'>
                <div className='bg-[#e6e3ff] text-[#362a96] font-semibold text-[15px] leading-5 tracking-[-0.16px] rounded-lg p-5'>
                  Please double-check that this is the correct inventory. You
                  can also change it afterwards in the scheduled order detail,
                  until the order is marked as delivered.
                </div>
              </div>
            </div>

            {/* Order details section */}
            <div className='pb-12.5'>
              <h2 className='text-[24px] font-semibold leading-8 tracking-[-0.01em] text-[#19191c] text-left mb-6'>
                Order details
              </h2>

              <div className='flex gap-6 max-w-[95%]'>
                {/* Left col — Supplier + Ordered on */}
                <div className='w-1/3'>
                  {/* Supplier */}
                  <div className='mb-7.5'>
                    <label className='block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6f] mb-1'>
                      Supplier *
                    </label>
                    <SupplierSearchDropdown
                      suppliers={suppliers}
                      selectedSupplier={selectedSupplier}
                      onSelect={(s) => {
                        setSelectedSupplier(s);
                        setSupplierError(!s);
                      }}
                      borderError={supplierError}
                      onBlur={() => {
                        if (!selectedSupplier) setSupplierError(true);
                      }}
                      className='w-full!'
                    />
                    {supplierError &&
                      errHighlight('Please enter a supplier name')}
                  </div>

                  {/* Ordered on */}
                  <DateInput
                    label='Ordered on *'
                    day={orderedDay}
                    month={orderedMonth}
                    year={orderedYear}
                    onDayChange={(v) => {
                      setOrderedDay(v);
                      if (!v) setOrderedDateError(true);
                      else setOrderedDateError(false);
                    }}
                    onMonthChange={(v) => {
                      setOrderedMonth(v);
                      if (!v) setOrderedDateError(true);
                      else setOrderedDateError(false);
                    }}
                    onYearChange={(v) => {
                      setOrderedYear(v);
                      if (!v) setOrderedDateError(true);
                      else setOrderedDateError(false);
                    }}
                    onDayBlur={() => {
                      if (!orderedDay) setOrderedDateError(true);
                    }}
                    onMonthBlur={() => {
                      if (!orderedMonth) setOrderedDateError(true);
                    }}
                    onYearBlur={() => {
                      if (!orderedYear) setOrderedDateError(true);
                    }}
                    hasError={orderedDateError}
                  />
                  {orderedDateError &&
                    errHighlight('Please enter a complete date')}
                </div>

                {/* Right col — Order number + Scheduled for */}
                <div className='w-2/3 max-w-99.5'>
                  {/* Order number */}
                  <div className='mb-7.5'>
                    <label className='block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6f] mb-1'>
                      Order number *
                    </label>
                    <input
                      type='text'
                      placeholder='Enter Order number'
                      value={orderNumber}
                      onChange={(e) => {
                        setOrderNumber(e.target.value);
                        setOrderNumberError(!e.target.value);
                      }}
                      onBlur={() => {
                        if (!orderNumber) setOrderNumberError(true);
                      }}
                      className={`w-full rounded-sm px-4 py-3 text-[14px] leading-6 outline-none ${
                        orderNumberError
                          ? 'border-2 border-[#e2232e] bg-[#fff0f1] text-[#333]'
                          : 'border border-[#d7d8e0] text-[#333] focus:border-green-600 focus:ring-1 focus:ring-green-600'
                      }`}
                    />
                    {orderNumberError && errHighlight('This field is required')}
                  </div>

                  {/* Scheduled for */}
                  <DateInput
                    label='Scheduled for *'
                    day={scheduledDay}
                    month={scheduledMonth}
                    year={scheduledYear}
                    onDayChange={(v) => {
                      setScheduledDay(v);
                      if (!v) setScheduledDateError(true);
                      else setScheduledDateError(false);
                    }}
                    onMonthChange={(v) => {
                      setScheduledMonth(v);
                      if (!v) setScheduledDateError(true);
                      else setScheduledDateError(false);
                    }}
                    onYearChange={(v) => {
                      setScheduledYear(v);
                      if (!v) setScheduledDateError(true);
                      setScheduledDateError(false);
                    }}
                    onDayBlur={() => {
                      if (!scheduledDay) setScheduledDateError(true);
                    }}
                    onMonthBlur={() => {
                      if (!scheduledMonth) setScheduledDateError(true);
                    }}
                    onYearBlur={() => {
                      if (!scheduledYear) setScheduledDateError(true);
                    }}
                    hasError={scheduledDateError}
                  />
                  {scheduledDateError &&
                    errHighlight('Please enter a complete date')}
                </div>
              </div>
            </div>
          </div>

          {/* Ordered items table */}
          <div>
            <h1 className='text-[24px] font-semibold leading-8 tracking-[-0.24px] text-[#19191c] pl-12.5 mb-5 text-left'>
              Ordered items
            </h1>

            <table className='w-full border-collapse'>
              <thead className='bg-[#fbfbfc]'>
                <tr>
                  {[
                    { label: 'Item name', cls: 'w-[35%] pl-[50px] text-left' },
                    { label: 'SKU', cls: 'w-[9%] text-right' },
                    { label: 'Quantity', cls: 'w-[7%] text-right' },
                    { label: 'Purchase Unit', cls: 'w-[14%] text-left pl-2' },
                    { label: 'Unit Price', cls: 'w-[11%] text-right pr-2' },
                    { label: 'Total Price', cls: 'w-[11%] text-right pr-2' },
                    { label: '', cls: 'w-[13%]' },
                  ].map((col) => (
                    <th
                      key={col.label}
                      className={`h-12 text-[11px] font-semibold uppercase tracking-[0.88px] text-[#737373] border-t border-b border-[#e7e7ec] bg-[#fbfbfc] sticky -top-px z-20 px-3 ${col.cls}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody style={{ overflow: 'visible' }}>
                {itemsLoading || items.length === 0
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>
                        <td className='h-16 px-3 pl-12.5 border-b border-[#e6e6ed]'>
                          <SkeletonBar style={{ height: 14, width: 200 }} />
                        </td>
                        <td className='h-16 px-3 text-right border-b border-[#e6e6ed]'>
                          <SkeletonBar
                            style={{
                              height: 12,
                              width: 60,
                              marginLeft: 'auto',
                            }}
                          />
                        </td>
                        <td className='h-16 px-3 text-right border-b border-[#e6e6ed]'>
                          <SkeletonBar
                            style={{
                              height: 12,
                              width: 50,
                              marginLeft: 'auto',
                            }}
                          />
                        </td>
                        <td className='h-16 px-3 border-b border-[#e6e6ed]'>
                          <SkeletonBar style={{ height: 12, width: 80 }} />
                        </td>
                        <td className='h-16 px-3 text-right border-b border-[#e6e6ed]'>
                          <SkeletonBar
                            style={{
                              height: 12,
                              width: 70,
                              marginLeft: 'auto',
                            }}
                          />
                        </td>
                        <td className='h-16 px-3 text-right border-b border-[#e6e6ed]'>
                          <SkeletonBar
                            style={{
                              height: 12,
                              width: 70,
                              marginLeft: 'auto',
                            }}
                          />
                        </td>
                        <td className='h-16 px-3 border-b border-[#e6e6ed]' />
                      </tr>
                    ))
                  : items.map((item, index) => (
                      <>
                        <tr key={item.id ?? index}>
                          {/* Item name */}
                          <td className='h-16 pl-12.5 px-3 relative overflow-visible'>
                            <input
                              type='text'
                              value={item.name}
                              ref={(el) => (nameInputRefs.current[index] = el)}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleItemChange(index, 'name', val);
                                handleItemChange(index, 'isFromSearch', false);
                                setSearchingIndex(index);
                                clearTimeout(searchTimerRef.current);
                                if (val.trim().length > 1) {
                                  setSearchLoading(true);
                                  searchTimerRef.current = setTimeout(
                                    async () => {
                                      const results = await searchProducts(val);
                                      console.log(
                                        'search results:',
                                        results[0],
                                      );
                                      setSearchResults(results);
                                      setSearchLoading(false);
                                    },
                                    350,
                                  );
                                } else {
                                  setSearchResults([]);
                                }
                              }}
                              onBlur={() =>
                                setTimeout(() => {
                                  setSearchingIndex(null);
                                  setSearchResults([]);
                                }, 300)
                              }
                              className='w-full h-8 px-1.5 text-[12px] font-semibold text-[#19191c] bg-transparent border-none outline-none hover:bg-[#f1f1f5] rounded transition-colors focus:bg-gray-100 focus:font-normal'
                            />
                            {searchingIndex === index &&
                              (searchResults.length > 0 || searchLoading) &&
                              (() => {
                                const rect =
                                  nameInputRefs.current[
                                    index
                                  ]?.getBoundingClientRect();
                                return (
                                  <div
                                    className='fixed w-72 bg-white border border-gray-200 rounded shadow-lg z-999 max-h-48 overflow-y-auto'
                                    style={{
                                      top: rect ? rect.bottom + 4 : 0,
                                      left: rect ? rect.left : 0,
                                    }}
                                  >
                                    {searchLoading ? (
                                      <div className='px-4 py-3 text-sm text-gray-400'>
                                        Searching...
                                      </div>
                                    ) : (
                                      searchResults.map((p) => (
                                        <div
                                          key={p.id}
                                          onMouseDown={(e) =>
                                            e.preventDefault()
                                          }
                                          onClick={() => {
                                            setItems((prev) =>
                                              prev.map((it, i) =>
                                                i !== index
                                                  ? it
                                                  : {
                                                      ...it,
                                                      name: p.name,
                                                      sku: p.sku ?? it.sku,
                                                      purchaseUnit:
                                                        p.purchaseUnitPlural ??
                                                        it.purchaseUnit,
                                                      pricePerPurchaseUnit:
                                                        p.pricePerStockTakingUnit ??
                                                        it.pricePerPurchaseUnit,
                                                      isFromSearch: true,
                                                    },
                                              ),
                                            );
                                            setSearchingIndex(null);
                                            setSearchResults([]);
                                          }}
                                          className='px-4 py-2.5 text-sm text-gray-700 cursor-pointer hover:bg-gray-50'
                                        >
                                          {p.name}
                                        </div>
                                      ))
                                    )}
                                  </div>
                                );
                              })()}
                          </td>

                          {/* SKU */}
                          <td className='h-16 px-3 text-right'>
                            <input
                              type='text'
                              placeholder='SKU'
                              value={item.sku ?? ''}
                              onChange={(e) =>
                                handleItemChange(index, 'sku', e.target.value)
                              }
                              className='w-full h-8 px-1.5 text-[11px] text-[#19191c] text-right bg-transparent border-none outline-none hover:bg-[#f1f1f5] rounded transition-colors focus:bg-gray-100'
                            />
                          </td>

                          {/* Quantity */}
                          <td className='h-16 px-3 text-right'>
                            <input
                              type='text'
                              placeholder='Qty'
                              value={item.orderQuantity ?? ''}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  'orderQuantity',
                                  e.target.value,
                                )
                              }
                              className={`w-full h-8 px-1.5 text-[11px] text-right bg-transparent border-none outline-none rounded transition-colors ${itemErrors[index]?.orderQuantity ? 'err-fields' : 'text-[#19191c] hover:bg-[#f1f1f5] focus:bg-gray-100'}`}
                            />
                          </td>

                          {/* Purchase Unit */}
                          <td className='h-16 px-3'>
                            <UnitDropdown
                              value={item.purchaseUnit ?? ''}
                              onChange={(val) =>
                                handleItemChange(index, 'purchaseUnit', val)
                              }
                              units={units}
                              placeholder='Purchase Unit'
                              disabled={!!item.isFromSearch}
                            />
                          </td>

                          {/* Unit Price */}
                          <td className='h-16 px-3'>
                            <div className='flex items-center justify-end gap-1'>
                              <input
                                type='text'
                                value={
                                  focusedPriceIndex === index
                                    ? (item.pricePerPurchaseUnit ?? '')
                                    : item.pricePerPurchaseUnit
                                      ? formatNumber(
                                          parseFloat(item.pricePerPurchaseUnit),
                                        )
                                      : ''
                                }
                                onFocus={() => setFocusedPriceIndex(index)}
                                onBlur={() => setFocusedPriceIndex(null)}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    'pricePerPurchaseUnit',
                                    e.target.value,
                                  )
                                }
                                className={`w-full h-8 px-1.5 text-[11px] text-right bg-transparent border-none outline-none rounded transition-colors ${itemErrors[index]?.pricePerPurchaseUnit ? 'err-fields' : 'text-[#19191c] hover:bg-[#f1f1f5] focus:bg-gray-100'}`}
                              />
                              <span className='text-[13px] text-[#19191c] shrink-0'>
                                kr
                              </span>
                            </div>
                          </td>

                          {/* Total Price */}
                          <td className='h-16 px-3'>
                            <div className='flex items-center justify-end gap-1'>
                              <input
                                type='text'
                                value={
                                  item.subtotal
                                    ? formatNumber(parseFloat(item.subtotal))
                                    : ''
                                }
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    'subtotal',
                                    e.target.value,
                                  )
                                }
                                placeholder='—'
                                className={`w-full h-8 px-1.5 text-[11px] text-right bg-transparent border-none outline-none rounded transition-colors ${itemErrors[index]?.subtotal ? 'err-fields' : 'text-[#19191c] hover:bg-[#f1f1f5] focus:bg-gray-100'}`}
                              />
                              <span className='text-[13px] text-[#19191c] shrink-0'>
                                {item.subtotal ? 'kr' : ''}
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className='h-16 px-3 text-center'>
                            <div className='flex items-center justify-center gap-5'>
                              <img
                                src='/icons/bin.svg'
                                alt='delete'
                                className='w-4.5 h-4.5 cursor-pointer brightness-0'
                                onClick={() => handleDeleteItem(index)}
                              />
                              <img
                                src='/icons/plus.svg'
                                alt='add'
                                className='w-5 h-5 cursor-pointer brightness-0'
                                onClick={() => handleAddItemBelow(index)}
                                data-tooltip-id='add-item-tooltip'
                                data-tooltip-content='Add item below'
                                data-tooltip-place='top'
                                data-tooltip-offset={8}
                              />
                            </div>
                          </td>
                        </tr>

                        {/* Divider row */}
                        <tr key={`divider-${index}`}>
                          <td colSpan={7} className='h-px p-0'>
                            <hr
                              className='border-0 border-t border-black/10 mx-0'
                              style={{ margin: '0 30px 0 50px' }}
                            />
                          </td>
                        </tr>
                      </>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between px-12 py-3.5 border-t border-[#e7e7ec]'>
          <WhiteButton
            onClick={() => (isDirty ? setShowDiscardModal(true) : onClose())}
          >
            Cancel
          </WhiteButton>

          {showError && (
            <div className='w-[60%] bg-[#fff0f1] text-[#a71a23] font-semibold text-[14px] leading-4.5 rounded px-3 py-2 flex items-center'>
              <img src='/icons/error.svg' className='w-5 ml-2 mr-2' />
              <span className='ml-2'>
                Fill in all the required fields before you continue
              </span>
            </div>
          )}

          <GreenButton
            onClick={handleSave}
            disabled={!isDirty}
            className='disabled:bg-[#a8d5b5] disabled:cursor-not-allowed disabled:opacity-100'
          >
            Save changes
          </GreenButton>
        </div>

        <Tooltip
          id='add-item-tooltip'
          place='top'
          positionStrategy='fixed'
          style={{
            backgroundColor: '#222',
            color: '#fff',
            fontSize: '12px',
            borderRadius: '4px',
            padding: '4px 6px',
            zIndex: 999,
          }}
        />
      </div>

      <ConfirmModal
        open={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        title='Discard changes?'
        description="You've made some changes to this scheduled order. Would you like to discard them?"
        confirmLabel='Discard Changes'
        cancelLabel='Keep Editing'
        onConfirm={() => {
          setShowDiscardModal(false);
          onClose();
        }}
      />
    </div>
  );
}
