import { useState, useRef, useEffect } from 'react';
import { searchProducts } from '../../services/productService';
import { formatPrice } from '../../utils/format';
import UnitDropdown from './UnitDropdown';

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
    touchedFields: {},
  };
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
    return (row.touched || row.touchedFields?.[field]) && !val;
  }

  const baseInput =
    'w-full h-8 px-1 text-[13px] leading-[32px] flex items-center font-normal text-[#19191c] bg-transparent border-none outline-none hover:bg-[#f1f1f5] rounded cursor-pointer transition-colors';

  function wrapClass(field, val) {
    return [
      'rounded transition-colors mx-1',
      isError(field, val)
        ? 'bg-[#fff0f1] hover:bg-[#fff0f1]'
        : 'hover:bg-[#f1f1f5]',
    ]
      .filter(Boolean)
      .join(' ');
  }

  function textClass(field, val) {
    if (isInventory && field === 'price' && row.touched && !val)
      return 'text-red-600';
    if (isError(field, val)) return 'text-[#a71a23]';
    if (val) return 'text-[#19191c]';
    return 'text-[#939397]';
  }
  const isAutoFilled = isInventory && !!row.unitId;

  return (
    <>
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
                <textarea
                  placeholder='Product name'
                  value={row.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={() =>
                    onChange({
                      ...row,
                      touchedFields: { ...row.touchedFields, name: true },
                    })
                  }
                  onFocus={() =>
                    suggestions.length > 0 && setShowSuggestions(true)
                  }
                  className={`${baseInput} resize-none overflow-hidden ${textClass('name', row.name)} ${row.name ? 'font-extrabold' : ''}`}
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
              onBlur={() =>
                onChange({
                  ...row,
                  touchedFields: { ...row.touchedFields, quantity: true },
                })
              }
              className={`${baseInput} text-right ${textClass('quantity', row.quantity)}`}
              style={{ height: 32, textAlign: 'right' }}
            />
          </div>
        </td>

        {/* Unit */}
        <td className='align-middle  py-1 text-[12px]' style={{ width: '13%' }}>
          <div
            className={[
              'rounded',
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
              placeholder={isInventory ? 'select unit' : 'purchase unit'}
            />
          </div>
        </td>

        {/* Price per unit  */}
        <td className='align-middle  py-1 text-right'>
          <div
            className={[
              'flex items-center pr-2 rounded transition-colors mx-1',
              isInventory
                ? row.touched && !row.price
                  ? 'bg-red-50 border border-red-200'
                  : 'hover:bg-[#f1f1f5]'
                : isError('price', row.price)
                  ? 'bg-[#fff0f1] hover:bg-[#fff0f1]'
                  : 'hover:bg-[#f1f1f5]',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {isAutoFilled ? (
              <span className='text-[13px] text-right text-[#333] px-1.5 flex-1'>
                {formatPrice(parseFloat(row.price))}
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
                onBlur={() =>
                  onChange({
                    ...row,
                    touched: true,
                    touchedFields: { ...row.touchedFields, price: true },
                  })
                }
                placeholder=''
                className={`outline-none border-none bg-transparent text-[13px] leading-5 h-8 px-1.5 text-right ${textClass('price', row.price)}`}
                style={{ width: '80%', height: 32, textAlign: 'right' }}
              />
            )}
            <label className='text-[13px] text-[#939397] shrink-0'>kr</label>
          </div>
        </td>

        {/* Total Price/Value */}
        <td className='align-middle py-1' className='align-middle py-1 pl-6'>
          <div className='flex items-center mr-1 rounded transition-colors hover:bg-[#f1f1f5]'>
            <input
              type='text'
              value={row.total ? formatPrice(parseFloat(row.total)) : ''}
              placeholder='0,00'
              readOnly
              className='outline-none border-none bg-transparent text-[13px] leading-5 h-8 px-1.5 text-right text-[#939397]'
              style={{
                width: '80%',
                height: 32,
                textAlign: 'right',
                color: row.total ? '#19191c' : '#939397',
              }}
            />
            {/* <label className='text-[13px] text-[#939397] shrink-0'>kr</label> */}
          </div>
        </td>

        {/* Delete */}
        <td
          className='align-middle py-1'
          className='align-middle py-1 pl-2 pr-4'
        >
          {isInventory ? (
            <button
              onClick={onDelete}
              className='flex items-center justify-center w-10 h-10 rounded-full hover:bg-emerald-100 transition cursor-pointer'
            >
              <img src='/icons/dark-bin.svg' width={20} height={20} alt='' />
            </button>
          ) : (
            <div
              onClick={onDelete}
              className='flex items-center justify-center w-12 h-12 rounded-full cursor-pointer group mb-2'
            >
              <img
                src='/icons/bin.svg'
                width={12}
                height={12}
                alt=''
                className='opacity-30 group-hover:opacity-100 transition-opacity duration-150'
              />
            </div>
          )}
        </td>
      </tr>

      {/* DIVIDER ROW  */}
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
  onChange,
  units = [],
  mode = 'inventory',
}) {
  const isInventory = mode === 'inventory';

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
        { label: 'SKU', pl: 54, width: '10%' },
        { label: 'PRODUCT NAME', pl: 48, width: '28%' },
        { label: 'QUANTITY', align: 'right', width: '10%' },
        { label: 'PURCHASE UNIT', width: '14%' },
        { label: 'PRICE PER PURCHASE UNIT', align: 'right', width: '16%' },
        { label: 'TOTAL PRICE', pl: 50, width: '14%' },
        { label: '', width: 'auto' },
      ];

  function handleRowChange(id, updated) {
    const updatedRows = rows.map((r) => (r.id === id ? updated : r));
    const last = updatedRows[updatedRows.length - 1];
    const isLast = last.id === id;

    if (isInventory) {
      if (isLast && updated.name && updated.unit && updated.price) {
        onChange([...updatedRows, emptyRow()]);
        return;
      }
    } else {
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

    onChange(remaining.length > 0 ? remaining : [emptyRow()]);
  }

  return (
    <table
      className='w-full border-collapse text-[13px]'
      style={{ tableLayout: 'auto' }}
    >
      <colgroup>
        {columns.map((col, i) => (
          <col key={i} style={{ width: col.width }} />
        ))}
      </colgroup>

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

                boxShadow: 'inset 0 1px 0 #e7e7ec, inset 0 -1px 0 #e7e7ec',
              }}
            >
              {col.label}

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
