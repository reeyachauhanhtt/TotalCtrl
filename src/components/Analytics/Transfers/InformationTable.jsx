import InfiniteScroll from 'react-infinite-scroll-component';
import InformationRow from './InformationRow';

const COLUMNS = [
  { key: 'type', label: 'TYPE', width: '10%', align: 'left', sortable: false },
  { key: 'item', label: 'ITEM', width: '15%', align: 'left', sortable: true },
  {
    key: 'date',
    label: 'TRANSFER DATE',
    width: '15%',
    align: 'left',
    sortable: true,
    defaultActive: true,
  },
  {
    key: 'transferredBy',
    label: 'TRANSFERRED BY',
    width: '15%',
    align: 'left',
    sortable: true,
  },
  {
    key: 'inventory',
    label: 'INVENTORY',
    width: '15%',
    align: 'left',
    sortable: true,
  },
  {
    key: 'quantity',
    label: 'QUANTITY',
    width: '15%',
    align: 'left',
    sortable: true,
  },
  {
    key: 'value',
    label: 'VALUE',
    width: '15%',
    align: 'right',
    sortable: true,
  },
];

export default function InformationTable({
  rows = [],
  sortKey,
  sortDir,
  onSort,
  fetchNextPage,
  hasNextPage,
  isLoading = false,
}) {
  const isEmpty = rows.length === 0;

  return (
    <div
      className='overflow-hidden border border-[#e7e7ec] rounded-lg shadow-[0_2px_4px_rgba(51,51,82,0.08),0_2px_6px_rgba(51,51,82,0.08)]'
      style={{ margin: 0 }}
    >
      {/* Fixed header */}
      <div className='border-t border-b border-[#e6e6ed] bg-[#f8f9fa]'>
        <table
          className='w-[95%] mx-auto border-collapse text-[13px]'
          style={{ tableLayout: 'fixed' }}
        >
          <thead>
            <tr>
              {COLUMNS.map((col, idx) => {
                const isActive = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && onSort?.(col.key)}
                    className={`
                      h-12 px-3 py-0 font-semibold text-[12px] tracking-[1px] uppercase bg-[#f8f9fa]
                      ${col.align === 'right' ? 'text-right' : 'text-left'}
                      ${idx === 0 ? 'pl-0' : ''}
                      ${idx === COLUMNS.length - 1 ? 'pr-0' : ''}
                      ${col.sortable ? 'cursor-pointer' : ''}
                      ${isActive ? 'text-[#23a956]' : 'text-[#737373]'}
                    `}
                    style={{ width: col.width }}
                  >
                    {col.label}
                    {col.sortable && (
                      <img
                        src={
                          isActive
                            ? sortDir === 'asc'
                              ? '/icons/asc-order-inv-green.svg'
                              : '/icons/desc-order-inv-green.svg'
                            : '/icons/desc-order.svg'
                        }
                        alt=''
                        className='inline align-middle ml-2'
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
        </table>
      </div>

      {/* Scrollable body */}
      <div
        id='transferScrollableDiv'
        className='overflow-y-auto bg-white'
        style={rows.length >= 10 ? { height: 500 } : { height: 'auto' }}
      >
        {isLoading ? (
          <table
            className='w-[95%] mx-auto border-collapse text-[13px]'
            style={{ tableLayout: 'fixed' }}
          >
            <tbody>
              {Array.from({ length: 3 }).map((_, i) => (
                <InformationRow key={i} isLoading />
              ))}
            </tbody>
          </table>
        ) : isEmpty ? (
          <div className='w-full flex justify-center items-center py-16'>
            <p className='text-[18px] text-[#97979b]'>No result found</p>
          </div>
        ) : (
          <div style={{ height: 'auto' }}>
            <InfiniteScroll
              dataLength={rows.length}
              next={fetchNextPage}
              hasMore={!!hasNextPage}
              loader={null}
              scrollableTarget='transferScrollableDiv'
              style={{ overflow: 'visible' }}
            >
              <table
                className='w-[95%] mx-auto border-collapse text-[13px]'
                style={{ tableLayout: 'fixed' }}
              >
                <tbody>
                  {rows.map((row, i) => (
                    <InformationRow key={i} {...row} />
                  ))}
                </tbody>
              </table>
            </InfiniteScroll>
            <div className='h-20' />
          </div>
        )}
      </div>
    </div>
  );
}
