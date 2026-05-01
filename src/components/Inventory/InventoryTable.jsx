// import { useState, useEffect } from 'react';
// import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
// import InventoryRow from './InventoryRow';
// import { TableRowSkeleton } from '../Common/Skeleton';

// export default function InventoryTable({ data, stockFilter, debouncedSearch }) {
//   const [selected, setSelected] = useState([]);
//   const [sortKey, setSortKey] = useState(null);
//   const [sortDir, setSortDir] = useState('asc');
//   const [isSorting, setIsSorting] = useState(false);
//   const [isFiltering, setIsFiltering] = useState(false);

//   useEffect(() => {
//     setIsFiltering(true);
//     const t = setTimeout(() => setIsFiltering(false), 300);
//     return () => clearTimeout(t);
//   }, [stockFilter, debouncedSearch]);

//   function handleSort(key) {
//     setIsSorting(true);
//     if (sortKey === key) {
//       setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
//     } else {
//       setSortKey(key);
//       setSortDir('asc');
//     }
//     setTimeout(() => setIsSorting(false), 300);
//   }

//   const sortedData = (() => {
//     const inStock = data.filter((i) => i.quantity !== 0);
//     const outOfStock = data.filter((i) => i.quantity === 0);

//     const sortedInStock = sortKey
//       ? [...inStock].sort((a, b) => {
//           const aVal = a[sortKey];
//           const bVal = b[sortKey];
//           if (aVal == null) return 1;
//           if (bVal == null) return -1;
//           const cmp =
//             typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal;
//           return sortDir === 'asc' ? cmp : -cmp;
//         })
//       : inStock;

//     // Out-of-stock only participates when sorting by quantity
//     const sortedOutOfStock =
//       sortKey === 'quantity'
//         ? [...outOfStock].sort((a, b) => (sortDir === 'asc' ? 0 : 0))
//         : outOfStock;

//     return [...sortedInStock, ...sortedOutOfStock];
//   })();

//   function toggleOne(id) {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
//     );
//   }

//   function toggleAll() {
//     if (selected.length === data.length) setSelected([]);
//     else setSelected(data.map((i) => i.id));
//   }

//   if (!data?.length) {
//     return (
//       <p className='text-gray-400 text-sm text-center py-12'>No items found.</p>
//     );
//   }

//   const allSelected = selected.length === data.length && data.length > 0;
//   const showSkeleton = isSorting || isFiltering;

//   const SortIcon = ({ col }) =>
//     sortKey === col ? (
//       sortDir === 'desc' ? (
//         <FiChevronDown size={12} />
//       ) : (
//         <FiChevronUp size={12} />
//       )
//     ) : (
//       <FiChevronUp size={12} className='text-gray-400' />
//     );

//   // th style: color:#5b636a, font-size:12px, uppercase, padding-top:5px, padding-bottom:5px
//   const thBase = {
//     paddingTop: 5,
//     paddingBottom: 5,
//     fontSize: 12,
//     color: '#5b636a',
//     fontWeight: 600,
//     textTransform: 'uppercase',
//     letterSpacing: '0.05em',
//     whiteSpace: 'nowrap',
//     cursor: 'pointer',
//     userSelect: 'none',
//   };

//   const thActive = { ...thBase, color: '#059669' }; // emerald-600

//   return (
//     <div className='mt-4 bg-white shadow-sm overflow-hidden h-full flex flex-col'>
//       {selected.length > 0 && (
//         <div className='flex justify-end items-center gap-3 px-4 py-3'>
//           <span className='text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded'>
//             {selected.length} ITEM{selected.length > 1 ? 'S' : ''} SELECTED
//           </span>
//           <button className='flex items-center gap-2 bg-red-500 text-white text-sm px-4 py-1.5 rounded'>
//             <img src='/icons/white-bin.svg' width={14} height={14} alt='' />
//             Delete
//           </button>
//         </div>
//       )}

//       <div className='overflow-y-auto flex-1'>
//         <table
//           className='w-full mb-0'
//           style={{ tableLayout: 'fixed', borderCollapse: 'collapse' }}
//         >
//           <colgroup>
//             <col style={{ width: 44 }} />
//             <col style={{ width: '28%' }} />
//             <col style={{ width: '16%' }} />
//             <col style={{ width: '16%' }} />
//             <col style={{ width: '12%' }} />
//             <col style={{ width: '12%' }} />
//             <col style={{ width: '13%' }} />
//             <col style={{ width: 60 }} />
//           </colgroup>

//           <thead
//             style={{
//               position: 'sticky',
//               top: -1,
//               left: 0,
//               zIndex: 10,
//               borderBottom: '1px solid #dee2e6',
//               borderTop: '1px solid #dee2e6',
//               backgroundColor: 'rgb(248, 249, 250)',
//             }}
//           >
//             <tr>
//               {/* Checkbox */}
//               <th
//                 style={{
//                   ...thBase,
//                   paddingLeft: 24,
//                   width: 55,
//                   cursor: 'default',
//                 }}
//                 className='text-left'
//               >
//                 <label className='flex items-center cursor-pointer'>
//                   <input
//                     type='checkbox'
//                     className='hidden'
//                     checked={allSelected}
//                     onChange={toggleAll}
//                   />
//                   <div
//                     className={`w-4 h-4 border rounded-sm flex items-center justify-center ${allSelected ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300 bg-white'}`}
//                   >
//                     {allSelected && (
//                       <svg
//                         className='w-3 h-3 text-white'
//                         viewBox='0 0 24 24'
//                         fill='none'
//                         stroke='currentColor'
//                         strokeWidth='3'
//                       >
//                         <path d='M5 13l4 4L19 7' />
//                       </svg>
//                     )}
//                   </div>
//                 </label>
//               </th>

//               <th
//                 style={{
//                   ...(sortKey === 'name' ? thActive : thBase),
//                   paddingLeft: 48,
//                 }}
//                 className='text-left'
//                 onClick={() => handleSort('name')}
//               >
//                 <span className='flex items-center gap-1'>
//                   Item <SortIcon col='name' />
//                 </span>
//               </th>

//               <th
//                 style={sortKey === 'arrivalInfo' ? thActive : thBase}
//                 className='text-left'
//                 onClick={() => handleSort('arrivalInfo')}
//               >
//                 <span className='flex items-center gap-1'>
//                   Arrival Info <SortIcon col='arrivalInfo' />
//                 </span>
//               </th>

//               <th
//                 style={sortKey === 'expirationInfo' ? thActive : thBase}
//                 className='text-left'
//                 onClick={() => handleSort('expirationInfo')}
//               >
//                 <span className='flex items-center gap-1'>
//                   Expiration Info <SortIcon col='expirationInfo' />
//                 </span>
//               </th>

//               <th
//                 style={sortKey === 'quantity' ? thActive : thBase}
//                 className='text-left'
//                 onClick={() => handleSort('quantity')}
//               >
//                 <span className='flex items-center gap-1'>
//                   Quantity <SortIcon col='quantity' />
//                 </span>
//               </th>

//               <th
//                 style={{
//                   ...(sortKey === 'unitPrice' ? thActive : thBase),
//                   paddingRight: 30,
//                 }}
//                 className='text-right'
//                 onClick={() => handleSort('unitPrice')}
//               >
//                 <span className='flex items-center justify-end gap-1'>
//                   Unit Price <SortIcon col='unitPrice' />
//                 </span>
//               </th>

//               <th
//                 style={{
//                   ...(sortKey === 'total' ? thActive : thBase),
//                   paddingRight: 48,
//                 }}
//                 className='text-right'
//                 onClick={() => handleSort('total')}
//               >
//                 <span className='flex items-center justify-end gap-1'>
//                   Total Value <SortIcon col='total' />
//                 </span>
//               </th>

//               <th style={{ ...thBase, width: 60, cursor: 'default' }} />
//             </tr>
//           </thead>

//           <tbody>
//             {showSkeleton
//               ? Array.from({ length: 8 }).map((_, i) => (
//                   <TableRowSkeleton key={i} asTr />
//                 ))
//               : sortedData.map((item, index) => (
//                   <InventoryRow
//                     key={item.id + '_' + index}
//                     item={item}
//                     selected={selected.includes(item.id)}
//                     onSelect={() => toggleOne(item.id)}
//                   />
//                 ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

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
    <div className='mt-4 bg-white shadow-sm overflow-hidden h-full flex flex-col'>
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

      <div className='overflow-y-auto flex-1'>
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
