import { useState, useRef, useEffect } from 'react';
import { searchProducts } from '../../services/productService';

// ─── Helper ────────────────────────────────────────────────────────────────────

export function emptyRow() {
  return {
    id: crypto.randomUUID(),
    sku: '',
    name: '',
    quantity: '',
    unit: '',
    unitId: '',
    price: '',
    total: '',
    touched: false,
  };
}

// ─── UnitDropdown ──────────────────────────────────────────────────────────────
// Dev CSS: .css-1lt8ujf-control — no border, h:33px, flex, justify-between
// Chevron: color rgb(215,216,224)

function UnitDropdown({ value, onChange, units, placeholder = 'Select unit' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className='relative w-full' ref={ref}>
      {/* trigger — no border, transparent bg, h-[33px] */}
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='flex items-center justify-between w-full h-8.25 px-2 text-[13px] bg-transparent outline-none cursor-default'
      >
        <span className={value ? 'text-[#333333]' : 'text-[#939397]'}>
          {value || placeholder}
        </span>
        {/* dev chevron svg */}
        <svg
          height='20'
          width='20'
          viewBox='0 0 20 20'
          aria-hidden='true'
          style={{ color: 'rgb(215,216,224)', flexShrink: 0 }}
        >
          <path d='M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z' />
        </svg>
      </button>

      {/* dropdown list — dev: border rgb(215,216,224), shadow, bg white/90, borderRadius 3px */}
      {open && (
        <div
          className='absolute left-0 w-full z-50 overflow-auto py-0.5'
          style={{
            top: 'calc(100% + 4px)',
            minWidth: '160px',
            maxHeight: '200px',
            borderRadius: '3px',
            border: '1px solid rgb(215,216,224)',
            boxShadow: 'rgba(0,0,0,0.1) 0px 2px 12px',
            background: 'rgba(255,255,255,0.9)',
            fontSize: '90%',
          }}
        >
          {units?.length > 0 ? (
            units.map((unit) => (
              <div
                key={unit.id}
                onClick={() => {
                  onChange(unit.value, unit.id);
                  setOpen(false);
                }}
                className={`px-3 py-2 text-[13px] cursor-pointer hover:bg-gray-100 ${
                  value === unit.value
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-[#333]'
                }`}
              >
                {unit.label}
              </div>
            ))
          ) : (
            <div className='px-3 py-2 text-[12px] text-[#939397]'>
              Loading units…
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── OrderItemRow ──────────────────────────────────────────────────────────────

function OrderItemRow({ row, onChange, onDelete, units, mode }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);
  const isInventory = mode === 'inventory';

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── search ──
  function handleNameChange(val) {
    onChange({ ...row, name: val, unitId: '' });
    clearTimeout(debounceRef.current);
    if (val.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchProducts(val.trim());
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }

  // ── select suggestion ──
  function handleSelect(product) {
    const unitLabel = product.stockTakingUnit || product.purchaseUnit || '';
    const unitId = product.stockTakingUnitId || product.purchaseUnitId || '';
    const cost =
      product.pricePerStockTakingUnit ?? product.pricePerPurchaseUnit ?? '';
    const sku = product.sku || '';
    const qty = row.quantity || '';
    const total =
      qty && cost ? (parseFloat(qty) * parseFloat(cost)).toFixed(2) : '';

    onChange({
      ...row,
      name: product.name || product.productName || '',
      sku,
      unit: unitLabel,
      unitId,
      price: String(cost),
      total,
    });
    setSuggestions([]);
    setShowSuggestions(false);
  }

  // ── recalc total ──
  function recalc(qty, price) {
    const q = parseFloat(qty);
    const p = parseFloat(price);
    return !isNaN(q) && !isNaN(p) ? (q * p).toFixed(2) : '';
  }

  // ── error check (order mode: all fields except sku & total) ──
  function isError(field, val) {
    if (isInventory) return false;
    if (field === 'sku' || field === 'total') return false;
    return row.touched && !val;
  }

  // dev .manualOrderTableInput input:
  // border:none, outline:none, bg:transparent, font-size:13px, h:32px, padding:6px, line-height:20px
  const baseInput =
    'border-none outline-none bg-transparent text-[13px] leading-5 h-8 px-1.5 w-full';

  // dev .manualOrderTableInput.error:
  // bg:#fff0f1, color:#a71a23, border-radius:4px
  function wrapClass(field, val) {
    return isError(field, val) ? 'bg-[#fff0f1] rounded' : '';
  }

  function textClass(field, val) {
    if (isInventory && field === 'price' && row.touched && !val)
      return 'text-red-600';
    return isError(field, val) ? 'text-[#a71a23]' : 'text-[#939397]';
  }

  const isAutoFilled = isInventory && !!row.unitId;

  return (
    <>
      {/* DATA ROW — dev .tableRow-ManualOrder td: border:none, height:64px */}
      <tr style={{ height: 64 }}>
        {/* SKU */}
        <td className='align-middle  py-1' style={{ paddingLeft: 48 }}>
          <div className={wrapClass('sku', row.sku)}>
            <input
              type='text'
              placeholder='SKU'
              value={row.sku}
              onChange={(e) => onChange({ ...row, sku: e.target.value })}
              disabled={isAutoFilled}
              className={`${baseInput} ${isAutoFilled ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ height: 32 }}
            />
          </div>
        </td>

        {/* Item / Product Name */}
        <td className='align-middle  py-1' style={{ paddingLeft: 48 }}>
          <div className='relative' ref={wrapperRef}>
            <div className={wrapClass('name', row.name)}>
              {isInventory ? (
                // inventory: plain input
                <input
                  type='text'
                  placeholder='Item name'
                  value={row.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onFocus={() =>
                    suggestions.length > 0 && setShowSuggestions(true)
                  }
                  className={`${baseInput} ${textClass('name', row.name)}`}
                  style={{ height: 32 }}
                />
              ) : (
                // order: textarea — dev: overflow:hidden, max-height:150px, min-height:32px
                <textarea
                  placeholder='Product name'
                  value={row.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onFocus={() =>
                    suggestions.length > 0 && setShowSuggestions(true)
                  }
                  className={`${baseInput} resize-none overflow-hidden ${textClass('name', row.name)}`}
                  style={{ minHeight: 32, maxHeight: 150, height: 32 }}
                  rows={1}
                />
              )}
            </div>

            {/* suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                className='absolute left-0 z-9999 overflow-auto'
                style={{
                  top: '100%',
                  marginTop: 8,
                  minWidth: '200px',
                  maxHeight: '200px',
                  borderRadius: '3px',
                  border: '1px solid rgb(215,216,224)',
                  boxShadow: 'rgba(0,0,0,0.1) 0px 2px 12px',
                  background: 'rgba(255,255,255,0.9)',
                  fontSize: '90%',
                }}
              >
                {suggestions.map((p, i) => (
                  <div
                    key={p.id ?? i}
                    onMouseDown={() => handleSelect(p)}
                    className='px-4 py-2 text-[13px] text-[#19191c] cursor-pointer hover:bg-gray-100'
                  >
                    {p.name || p.productName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </td>

        {/* Quantity */}
        <td className='align-middle  py-1 text-right'>
          <div className={wrapClass('quantity', row.quantity)}>
            <input
              type='text'
              placeholder='Quantity'
              value={row.quantity}
              onChange={(e) => {
                const qty = e.target.value;
                const total = recalc(qty, row.price);
                onChange({ ...row, quantity: qty, total, touched: true });
              }}
              className={`${baseInput} text-right ${textClass('quantity', row.quantity)}`}
              style={{ height: 32, textAlign: 'right' }}
            />
          </div>
        </td>

        {/* Unit */}
        <td className='align-middle  py-1 text-[13px]' style={{ width: '13%' }}>
          <div
            className={[
              'rounded',
              isError('unit', row.unit) ? 'bg-[#fff0f1]' : '',
              isAutoFilled ? 'opacity-50 pointer-events-none' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <UnitDropdown
              value={row.unit}
              onChange={(val, id) =>
                onChange({ ...row, unit: val, unitId: id })
              }
              units={units}
              placeholder={isInventory ? 'Select unit' : 'Purchase unit'}
            />
          </div>
        </td>

        {/* Price per unit — dev: .manualOrderTableInput.price, input 80% + kr label */}
        <td className='align-middle  py-1 text-right'>
          <div
            className={[
              'flex items-center pr-2 rounded',
              isInventory
                ? row.touched && !row.price
                  ? 'bg-red-50 border border-red-200'
                  : 'hover:bg-gray-100'
                : isError('price', row.price)
                  ? 'bg-[#fff0f1]'
                  : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {isAutoFilled ? (
              <span className='text-[13px] text-right text-[#333] px-1.5 flex-1'>
                {row.price}
              </span>
            ) : (
              <input
                type='text'
                value={row.price}
                onChange={(e) => {
                  const price = e.target.value;
                  const total = recalc(row.quantity, price);
                  onChange({ ...row, price, total });
                }}
                onBlur={() => onChange({ ...row, touched: true })}
                placeholder=''
                className={`outline-none border-none bg-transparent text-[13px] leading-5 h-8 px-1.5 text-right ${textClass('price', row.price)}`}
                style={{ width: '80%', height: 32, textAlign: 'right' }}
              />
            )}
            {/* dev: .lbl-active — color:#19191c, font-size:13px */}
            <label className='text-[13px] text-[#19191c] shrink-0'>kr</label>
          </div>
        </td>

        {/* Total — always read-only */}
        <td className='align-middle py-1' style={{ paddingLeft: 50 }}>
          <div className='flex items-center mr-1'>
            <input
              type='text'
              value={row.total}
              readOnly
              className='outline-none border-none bg-transparent text-[13px] leading-5 h-8 px-1.5 text-right text-[#939397]'
              style={{ width: '80%', height: 32, textAlign: 'right' }}
            />
            <label className='text-[13px] text-[#19191c] shrink-0'>kr</label>
          </div>
        </td>

        {/* Delete */}
        <td
          className='align-middle py-1'
          style={{ paddingLeft: 28, paddingRight: 48 }}
        >
          {isInventory ? (
            // inventory: green circle hover — existing AddItemModal style
            <button
              onClick={onDelete}
              className='flex items-center justify-center w-10 h-10 rounded-full hover:bg-emerald-100 transition cursor-pointer'
            >
              <img src='/icons/dark-bin.svg' width={20} height={20} alt='' />
            </button>
          ) : (
            // order: dev .action-event — w:48px, h:48px, flex, center, border-radius:50%
            // gray icon initially, hover → black (opacity transition)
            <div
              onClick={onDelete}
              className='flex items-center justify-center w-12 h-12 rounded-full cursor-pointer group mb-2'
            >
              <img
                src='/icons/dark-bin.svg'
                width={20}
                height={20}
                alt=''
                className='opacity-30 group-hover:opacity-100 transition-opacity duration-150'
              />
            </div>
          )}
        </td>
      </tr>

      {/* DIVIDER ROW — dev pattern: tr > td > hr with margin 0 48px short border */}
      <tr>
        <td colSpan={7} style={{ height: 1, padding: 0 }}>
          <hr style={{ margin: '0 48px', borderColor: '#e6e6ed' }} />
        </td>
      </tr>
    </>
  );
}

// ─── OrderItemsTable (exported) ────────────────────────────────────────────────

export default function OrderItemsTable({
  rows,
  onChange, // (updatedRows: Row[]) => void
  units = [],
  mode = 'inventory', // 'inventory' | 'order'
}) {
  const isInventory = mode === 'inventory';

  // column config per mode — widths & labels from dev HTML
  const columns = isInventory
    ? [
        { label: 'SKU', pl: 54, width: '12%' },
        { label: 'ITEM NAME', asterisk: true, width: '35%' },
        { label: 'QUANTITY', align: 'right', width: '8%', pr: 10 },
        { label: 'UNIT', asterisk: true, pl: 13, width: '15%' },
        {
          label: 'COST PER UNIT',
          asterisk: true,
          align: 'right',
          width: '11%',
        },
        { label: 'TOTAL VALUE', asterisk: true, align: 'right', width: '11%' },
        { label: '', width: '8%' },
      ]
    : [
        { label: 'SKU', pl: 54, width: '12%' },
        { label: 'PRODUCT NAME', pl: 48, width: '25%' },
        { label: 'QUANTITY', align: 'right', width: '10%' },
        { label: 'PURCHASE UNIT', width: '13%' },
        { label: 'PRICE PER PURCHASE UNIT', align: 'right', width: '13%' },
        { label: 'TOTAL PRICE', pl: 50, width: '11%' },
        { label: '', width: '5%' },
      ];

  function handleRowChange(id, updated) {
    const updatedRows = rows.map((r) => (r.id === id ? updated : r));
    const last = updatedRows[updatedRows.length - 1];
    const isLast = last.id === id;

    if (isInventory) {
      // add new row when name + unit + price all filled on last row
      if (isLast && updated.name && updated.unit && updated.price) {
        onChange([...updatedRows, emptyRow()]);
        return;
      }
    } else {
      // add new row when quantity entered on last row (was previously empty)
      const prevLast = rows[rows.length - 1];
      if (isLast && updated.quantity && !prevLast.quantity) {
        onChange([...updatedRows, emptyRow()]);
        return;
      }
    }

    onChange(updatedRows);
  }

  function handleDeleteRow(id) {
    const remaining = rows.filter((r) => r.id !== id);
    // always keep at least one empty row
    onChange(remaining.length > 0 ? remaining : [emptyRow()]);
  }

  return (
    <table
      className='w-full border-collapse text-[13px]'
      style={{ tableLayout: 'fixed' }}
    >
      <colgroup>
        {columns.map((col, i) => (
          <col key={i} style={{ width: col.width }} />
        ))}
      </colgroup>

      {/* STICKY THEAD — dev .stickyHeader th: sticky, top:0, z-index:30, h:40px, box-shadow inset */}
      <thead>
        <tr
          style={{
            borderBottom: '1px solid rgb(231,231,236)',
            borderTop: '1px solid rgb(231,231,236)',
            backgroundColor: 'rgb(251,251,252)',
          }}
        >
          {columns.map((col, i) => (
            <th
              key={i}
              // dev: .card-table thead th — font-weight:700, font-size:11px, letter-spacing:1px, color:#737373
              className='text-[11px] font-bold uppercase tracking-[1px] text-[#737373]'
              style={{
                height: 40,
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: col.pl ?? 12,
                paddingRight: col.pr ?? 0,
                textAlign: col.align || 'left',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                backgroundColor: 'rgb(251,251,252)',
                // dev: inset box-shadow for top + bottom border on sticky
                boxShadow: 'inset 0 1px 0 #e7e7ec, inset 0 -1px 0 #e7e7ec',
              }}
            >
              {col.label}
              {/* dev: .required-asterisk — color:#e2232e */}
              {col.asterisk && (
                <span style={{ color: '#e2232e' }} className='ml-0.5'>
                  *
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <OrderItemRow
            key={row.id}
            row={row}
            units={units}
            mode={mode}
            onChange={(updated) => handleRowChange(row.id, updated)}
            onDelete={() => handleDeleteRow(row.id)}
          />
        ))}
      </tbody>
    </table>
  );
}
