import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

import InventoryRow from './InventoryRow';
import Checkbox from '../Common/Checkbox';
import { TableRowSkeleton } from '../Common/Skeleton';
import GreenButton from '../Common/GreenButton';
import { generateProductsPdf } from '../../services/productService';
import { INVENTORY_SORT_KEYS, SORT_DIRECTIONS } from '../../constants/sortKeys';
import { PERMISSIONS } from '../../constants/permissions';

export default function InventoryTable({
  data,
  stockFilter,
  debouncedSearch,
  onAddClick,
}) {
  const [selected, setSelected] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(SORT_DIRECTIONS.ASC);
  const [isSorting, setIsSorting] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);
  const isViewOnly =
    selectedInventory &&
    selectedInventory.permission?.toLowerCase() !==
      PERMISSIONS.EDITOR.toLowerCase();

  const selectedBarRef = useRef(null);
  const [selectedBarHeight, setSelectedBarHeight] = useState(44);

  useEffect(() => {
    if (selectedBarRef.current) {
      setSelectedBarHeight(selectedBarRef.current.offsetHeight);
    }
  });

  useEffect(() => {
    setIsFiltering(true);
    const t = setTimeout(() => setIsFiltering(false), 300);
    return () => clearTimeout(t);
  }, [stockFilter, debouncedSearch]);

  function handleSort(key) {
    setIsSorting(true);
    if (sortKey === key) {
      setSortDir((prev) =>
        prev === SORT_DIRECTIONS.ASC
          ? SORT_DIRECTIONS.DESC
          : SORT_DIRECTIONS.ASC,
      );
    } else {
      setSortKey(key);
      setSortDir(SORT_DIRECTIONS.ASC);
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
        return sortDir === SORT_DIRECTIONS.ASC ? cmp : -cmp;
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

  async function handlePrintTemplate() {
    const res = await generateProductsPdf();
    if (res?.Data?.reportUrl) {
      window.open(res.Data.reportUrl, '_blank');
    }
  }

  const allSelected = selected.length === data.length && data.length > 0;
  const showSkeleton = isSorting || isFiltering;

  const thBase = {
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 12,
    fontWeight: 600,
    color: '#5b636a',
    textAlign: 'left',
    // borderTop: '1px solid #dee2e6',
    // borderBottom: '1px solid #dee2e6',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    backgroundColor: 'rgb(248,249,250)',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  };

  const SortIcon = ({ col }) =>
    sortKey === col ? (
      sortDir === SORT_DIRECTIONS.DESC ? (
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
        <div
          ref={selectedBarRef}
          className='sticky top-0 z-20 flex justify-end items-center gap-3 px-4 py-3 bg-white shadow-sm'
        >
          <span className='text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded'>
            {selected.length} ITEM{selected.length > 1 ? 'S' : ''} SELECTED
          </span>
          <button className='flex items-center gap-2 bg-red-500 text-white text-sm px-4 py-1.5 rounded'>
            <img src='/icons/white-bin.svg' width={12} height={12} alt='' />
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
              top: selected.length > 0 ? selectedBarHeight - 1 : -1,
              zIndex: 9,
              backgroundColor: 'rgb(248,249,250)',
              borderTop: '1px solid #dee2e6',
              borderBottom: '1px solid #dee2e6',
              boxShadow: '0 1px 0 0 #dee2e6',
              overflow: 'hidden',
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
                <div className='mb-5'>
                  <Checkbox
                    checked={allSelected}
                    onChange={isViewOnly ? undefined : toggleAll}
                    disabled={isViewOnly}
                  />
                </div>
              </th>

              {/* Item */}
              <th
                style={{
                  ...thBase,
                  paddingLeft: 48,
                  ...thActive(INVENTORY_SORT_KEYS.NAME),
                }}
                onClick={() => handleSort(INVENTORY_SORT_KEYS.NAME)}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Item <SortIcon col={INVENTORY_SORT_KEYS.NAME} />
                </span>
              </th>

              {/* Arrival Info */}
              <th
                style={{
                  ...thBase,
                  ...thActive(INVENTORY_SORT_KEYS.ARRIVAL_INFO),
                }}
                onClick={() => handleSort(INVENTORY_SORT_KEYS.ARRIVAL_INFO)}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Arrival info.{' '}
                  <SortIcon col={INVENTORY_SORT_KEYS.ARRIVAL_INFO} />
                </span>
              </th>

              {/* Expiration Info */}
              <th
                style={{
                  ...thBase,
                  ...thActive(INVENTORY_SORT_KEYS.EXPIRATION_INFO),
                }}
                onClick={() => handleSort(INVENTORY_SORT_KEYS.EXPIRATION_INFO)}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Expiration info.{' '}
                  <SortIcon col={INVENTORY_SORT_KEYS.EXPIRATION_INFO} />
                </span>
              </th>

              {/* Quantity */}
              <th
                style={{
                  ...thBase,
                  ...thActive(INVENTORY_SORT_KEYS.QUANTITY),
                }}
                onClick={() => handleSort(INVENTORY_SORT_KEYS.QUANTITY)}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Quantity <SortIcon col={INVENTORY_SORT_KEYS.QUANTITY} />
                </span>
              </th>

              {/* Unit Price */}
              <th
                style={{
                  ...thBase,
                  textAlign: 'center',
                  ...thActive(INVENTORY_SORT_KEYS.UNIT_PRICE),
                }}
                onClick={() => handleSort(INVENTORY_SORT_KEYS.UNIT_PRICE)}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Unit Price <SortIcon col={INVENTORY_SORT_KEYS.UNIT_PRICE} />
                </span>
              </th>

              {/* Total Value */}
              <th
                style={{
                  ...thBase,
                  textAlign: 'right',
                  paddingRight: 30,
                  ...thActive(INVENTORY_SORT_KEYS.TOTAL),
                }}
                onClick={() => handleSort(INVENTORY_SORT_KEYS.TOTAL)}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  Total value <SortIcon col={INVENTORY_SORT_KEYS.TOTAL} />
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

          <tbody
            style={{
              borderBottom: data?.length ? '1px solid #dee2e6' : 'none',
            }}
          >
            {showSkeleton ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRowSkeleton key={i} asTr />
              ))
            ) : !data?.length ? (
              <tr>
                <td colSpan={8}>
                  <div className='flex justify-center pt-20'>
                    <div className='text-center px-12 py-9'>
                      <div className='mb-5'>
                        <img
                          src='/icons/empty-state-NotFound.svg'
                          alt=''
                          className='mx-auto'
                        />
                      </div>
                      <div className='text-[24px] font-semibold leading-8 tracking-[-0.01em] text-[#19191c] w-135 mx-auto'>
                        There's nothing in this inventory yet
                      </div>
                      <p className='text-sm text-[#97979b] text-center w-135 mx-auto mt-4 mb-8'>
                        Start by counting and adding your current stock.
                        <br />
                        Use the mobile app to do it, or{' '}
                        <span
                          className='border-b border-[#6b6b6f] cursor-pointer'
                          onClick={handlePrintTemplate}
                        >
                          print a paper template
                        </span>{' '}
                        to help you note down all the required information. When
                        you're done counting, hit the button below to add the
                        initial stock in bulk.
                      </p>
                      <GreenButton onClick={onAddClick}>
                        <span className='font-semibold'>
                          Set up initial stock
                        </span>
                      </GreenButton>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((item, index) => (
                <InventoryRow
                  key={item.id + '_' + index}
                  item={item}
                  selected={selected.includes(item.id)}
                  onSelect={() => toggleOne(item.id)}
                  isViewOnly={isViewOnly}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
