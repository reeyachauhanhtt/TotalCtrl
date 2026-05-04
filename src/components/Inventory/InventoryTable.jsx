import { useState, useEffect } from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import InventoryRow from './InventoryRow';
import { TableRowSkeleton } from '../Common/Skeleton';

export default function InventoryTable({ data, stockFilter, debouncedSearch }) {
  const [selected, setSelected] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [isSorting, setIsSorting] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    setIsFiltering(true);
    const t = setTimeout(() => setIsFiltering(false), 300);
    return () => clearTimeout(t);
  }, [stockFilter, debouncedSearch]);

  function handleSort(key) {
    setIsSorting(true);
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setTimeout(() => setIsSorting(false), 300);
  }

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        const cmp =
          typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal;
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  function toggleOne(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  function toggleAll() {
    if (selected.length === data.length) {
      setSelected([]);
    } else {
      setSelected(data.map((i) => i.id));
    }
  }

  if (!data?.length) {
    return (
      <p className='text-gray-400 text-sm text-center py-12'>No items found.</p>
    );
  }

  const allSelected = selected.length === data.length && data.length > 0;
  const showSkeleton = isSorting || isFiltering;

  // Shared th styles — matches dev .pd-y-5 + slim.css th styles
  const thBase = {
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 12,
    fontWeight: 400,
    color: '#5b636a',
    textAlign: 'left',
    borderTop: '1px solid #dee2e6',
    borderBottom: '1px solid #dee2e6',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    backgroundColor: 'rgb(248,249,250)',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  };

  const SortIcon = ({ col }) =>
    sortKey === col ? (
      sortDir === 'desc' ? (
        <FiChevronDown size={12} style={{ marginLeft: 4, flexShrink: 0 }} />
      ) : (
        <FiChevronUp size={12} style={{ marginLeft: 4, flexShrink: 0 }} />
      )
    ) : (
      <FiChevronUp
        size={12}
        style={{ marginLeft: 4, flexShrink: 0, color: '#9ca3af' }}
      />
    );

  const thActive = (col) =>
    sortKey === col ? { color: '#059669', fontWeight: 600 } : {};

  return (
    <div>
      {selected.length > 0 && (
        <div className='flex justify-end items-center gap-3 px-4 py-3'>
          <span className='text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded'>
            {selected.length} ITEM{selected.length > 1 ? 'S' : ''} SELECTED
          </span>
          <button className='flex items-center gap-2 bg-red-500 text-white text-sm px-4 py-1.5 rounded'>
            <img src='/icons/white-bin.svg' width={14} height={14} alt='' />
            Delete
          </button>
        </div>
      )}

      <div>
        <table
          className='inventorytbl mg-b-0 tx-13'
          style={{
            width: '100%',
            margin: 'auto',
            borderCollapse: 'collapse',
            fontSize: 13,
          }}
        >
          <colgroup>
            <col style={{ width: 44 }} />
            <col style={{ width: '28%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: 60 }} />
          </colgroup>

          {/* STICKY THEAD */}
          <thead
            style={{
              position: 'sticky',
              top: -1,
              left: 0,
              zIndex: 10,
              backgroundColor: 'rgb(248,249,250)',
            }}
          >
            <tr>
              {/* Checkbox */}
              <th
                style={{
                  ...thBase,
                  paddingLeft: 24,
                  width: 44,
                  cursor: 'default',
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type='checkbox'
                    className='hidden'
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      border: allSelected
                        ? '1px solid #059669'
                        : '1px solid #d1d5db',
                      borderRadius: 4,
                      backgroundColor: allSelected ? '#059669' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {allSelected && (
                      <svg
                        width='14'
                        height='14'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='white'
                        strokeWidth='3'
                      >
                        <path d='M5 13l4 4L19 7' />
                      </svg>
                    )}
                  </div>
                </label>
              </th>

              {/* Item */}
              <th
                style={{ ...thBase, paddingLeft: 48, ...thActive('name') }}
                onClick={() => handleSort('name')}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Item <SortIcon col='name' />
                </span>
              </th>

              {/* Arrival Info */}
              <th
                style={{ ...thBase, ...thActive('arrivalInfo') }}
                onClick={() => handleSort('arrivalInfo')}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Arrival info. <SortIcon col='arrivalInfo' />
                </span>
              </th>

              {/* Expiration Info */}
              <th
                style={{ ...thBase, ...thActive('expirationInfo') }}
                onClick={() => handleSort('expirationInfo')}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Expiration info. <SortIcon col='expirationInfo' />
                </span>
              </th>

              {/* Quantity */}
              <th
                style={{ ...thBase, ...thActive('quantity') }}
                onClick={() => handleSort('quantity')}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Quantity <SortIcon col='quantity' />
                </span>
              </th>

              {/* Unit Price */}
              <th
                style={{
                  ...thBase,
                  textAlign: 'center',
                  ...thActive('unitPrice'),
                }}
                onClick={() => handleSort('unitPrice')}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Unit Price <SortIcon col='unitPrice' />
                </span>
              </th>

              {/* Total Value */}
              <th
                style={{
                  ...thBase,
                  textAlign: 'right',
                  paddingRight: 30,
                  ...thActive('total'),
                }}
                onClick={() => handleSort('total')}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  Total value <SortIcon col='total' />
                </span>
              </th>

              {/* Actions */}
              <th
                style={{
                  ...thBase,
                  paddingRight: 48,
                  cursor: 'default',
                  width: 60,
                }}
              />
            </tr>
          </thead>

          {/* TBODY */}
          <tbody>
            {showSkeleton
              ? Array.from({ length: 8 }).map((_, i) => (
                  <TableRowSkeleton key={i} asTr />
                ))
              : sortedData.map((item, index) => (
                  <InventoryRow
                    key={item.id + '_' + index}
                    item={item}
                    selected={selected.includes(item.id)}
                    onSelect={() => toggleOne(item.id)}
                  />
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
