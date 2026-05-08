import { useState, useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';

import GreenButton from '../Common/GreenButton';
import WhiteButton from '../Common/WhiteButton';
import ConfirmModal from '../Common/ConfirmModal';
import SupplierSearchDropdown from '../ExternalOrder/SupplierSearchDropdown';

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
  onSave,
}) {
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [supplierError, setSupplierError] = useState(false);
  const [orderNumberError, setOrderNumberError] = useState(false);

  const [orderedDateError, setOrderedDateError] = useState(false);
  const [scheduledDateError, setScheduledDateError] = useState(false);

  // Ordered on
  const [orderedDay, setOrderedDay] = useState('');
  const [orderedMonth, setOrderedMonth] = useState('');
  const [orderedYear, setOrderedYear] = useState('');

  // Scheduled for
  const [scheduledDay, setScheduledDay] = useState('');
  const [scheduledMonth, setScheduledMonth] = useState('');
  const [scheduledYear, setScheduledYear] = useState('');

  const [items, setItems] = useState([]);

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
  }, [open, order]);

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
        : '');

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
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
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

    if (hasError) return;

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
            <h1 className='text-[24px] font-semibold leading-8 tracking-[-0.24px] text-[#19191c] pl-12.5 mb-5'>
              Ordered items
            </h1>

            <table className='w-full border-collapse'>
              <thead className='bg-[#fbfbfc]'>
                <tr>
                  {[
                    { label: 'Item name', cls: 'w-[38%] pl-[50px] text-left' },
                    { label: 'SKU', cls: 'w-[8%] text-right' },
                    { label: 'Quantity', cls: 'w-[7%] text-right' },
                    { label: 'Purchase Unit', cls: 'w-[12%]' },
                    { label: 'Unit Price', cls: 'w-[10%] text-right' },
                    { label: 'Total Price', cls: 'w-[10%] text-right' },
                    { label: '', cls: 'w-[5%]' },
                  ].map((col) => (
                    <th
                      key={col.label}
                      className={`h-12 text-[11px] font-semibold uppercase tracking-[0.88px] text-[#737373] border-t border-b border-[#e7e7ec] px-3 ${col.cls}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id ?? index}
                    className='border-b border-[#e6e6ed]'
                  >
                    <td className='h-16 px-3 pl-12.5 text-[14px]'>
                      <input
                        type='text'
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(index, 'name', e.target.value)
                        }
                        className='w-full text-[13px] font-semibold text-[#19191c] outline-none bg-transparent'
                      />
                    </td>
                    <td className='h-16 px-3 text-right text-[14px]'>
                      <input
                        type='text'
                        value={item.sku ?? ''}
                        onChange={(e) =>
                          handleItemChange(index, 'sku', e.target.value)
                        }
                        placeholder='SKU'
                        className='w-full text-[12px] text-[#19191c] text-right outline-none bg-transparent'
                      />
                    </td>

                    <td className='h-16 px-3 text-right'>
                      <input
                        type='text'
                        value={item.orderQuantity ?? ''}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            'orderQuantity',
                            e.target.value,
                          )
                        }
                        placeholder='Qty'
                        className='w-full text-[12px] text-[#19191c] text-right outline-none bg-transparent'
                      />
                    </td>

                    <td className='h-16 px-3 text-[12px] text-[#19191c]'>
                      {item.purchaseUnit ?? '—'}
                    </td>

                    <td className='h-16 px-3 text-right text-[12px] text-[#19191c]'>
                      <input
                        type='text'
                        value={item.pricePerPurchaseUnit ?? ''}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            'pricePerPurchaseUnit',
                            e.target.value,
                          )
                        }
                        className='w-full text-right outline-none bg-transparent'
                      />
                    </td>

                    <td className='h-16 px-3 text-right text-[12px] font-semibold text-[#19191c]'>
                      {item.subtotal ?? '—'}
                    </td>

                    <td className='h-16 px-3 text-center'>
                      <div className='flex items-center justify-center gap-5'>
                        <img
                          src='/icons/dark-bin.svg'
                          alt='delete'
                          className='w-5 h-5 cursor-pointer brightness-0'
                          onClick={() => handleDeleteItem(index)}
                        />

                        {/* + button with tooltip */}
                        <img
                          src='/icons/plus.svg'
                          alt='add'
                          className='w-4 h-4 cursor-pointer brightness-0'
                          onClick={() => handleAddItemBelow(index)}
                          data-tooltip-id='add-item-tooltip'
                          data-tooltip-content='Add item below'
                        />
                      </div>
                    </td>
                  </tr>
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
          classNameArrow='tooltip-arrow'
          style={{
            backgroundColor: '#222',
            color: '#fff',
            fontSize: '13px',
            borderRadius: '4px',
            padding: '12px',
            zIndex: 9999,
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
