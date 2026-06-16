import InfiniteScroll from 'react-infinite-scroll-component';
import FoodUsageRow from './FoodUsageRow';

const TABLE_HEADERS = [
  { label: 'ITEM NAME', align: 'left', width: '40%' },
  { label: 'USED FOOD', align: 'left', width: '10%' },
  { label: 'VALUE', align: 'left', width: '10%' },
  { label: 'FOOD WASTE', align: 'left', width: '10%' },
  { label: 'VALUE', align: 'left', width: '10%' },
  { label: 'TOTAL', align: 'right', width: '10%' },
  { label: 'CHECKED OUT', align: 'left', width: '10%' },
];

export default function FoodUsageTable({
  data = [],
  loading,
  fetchNextPage,
  hasNextPage,
}) {
  const isEmpty = data.length === 0;

  return (
    <div className='mt-15 overflow-hidden border border-[#e7e7ec] rounded-lg shadow-[0_2px_4px_rgba(51,51,82,0.08),0_2px_6px_rgba(51,51,82,0.08)]'>
      {/* Fixed Header */}
      <div className='border-t border-b border-[#e6e6ed] bg-[#f8f9fa]'>
        <table
          className='w-[95%] mx-auto border-collapse text-[13px]'
          style={{ tableLayout: 'fixed' }}
        >
          <thead>
            <tr>
              {TABLE_HEADERS.map((col, idx) => (
                <th
                  key={idx}
                  className={`
                    h-12 px-3 py-0 font-semibold text-[12px] tracking-[1px] uppercase text-[#737373] bg-[#f8f9fa]
                    ${col.align === 'right' ? 'text-right' : 'text-left'}
                    ${idx === 0 ? 'pl-0' : ''}
                    ${idx === TABLE_HEADERS.length - 1 ? 'pr-0' : ''}
                  `}
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      {/* Scrollable Body */}
      <div
        id='scrollableDiv'
        className='overflow-y-auto bg-white'
        style={data.length > 8 ? { height: 420 } : { height: 'auto' }}
      >
        {loading ? (
          <table
            className='w-[95%] mx-auto border-collapse text-[13px]'
            style={{ tableLayout: 'fixed' }}
          >
            <tbody>
              {Array.from({ length: 1 }).map((_, i) => (
                <FoodUsageRow key={i} isLoading />
              ))}
            </tbody>
          </table>
        ) : isEmpty ? (
          <div className='h-125 w-full flex flex-col justify-center items-center'>
            <img
              src='/img/lemon.png'
              alt='No Food Usage'
              className='align-middle border-none'
              style={{ height: 108, width: 151 }}
            />
            <span className='font-semibold text-[24px] leading-8 tracking-[-0.01em] text-[#19191c] text-center mt-6'>
              No Food Usage
            </span>
            <h3 className='font-normal text-base leading-snug text-center text-[#97979b] mt-2'>
              Remember to use the app to check out products every time you use
              something in the kitchen.
            </h3>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={data.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            // loader={null}
            loader={
              <table
                className='w-[95%] mx-auto border-collapse text-[13px]'
                style={{ tableLayout: 'fixed' }}
              >
                <tbody>
                  <FoodUsageRow isLoading />
                </tbody>
              </table>
            }
            scrollableTarget='scrollableDiv'
            style={{ overflow: 'visible' }}
          >
            <table
              className='w-[95%] mx-auto border-collapse text-[13px]'
              style={{ tableLayout: 'fixed' }}
            >
              <tbody>
                {data.map((item, idx) => (
                  <FoodUsageRow key={idx} item={item} />
                ))}
              </tbody>
            </table>

            <div className='h-20' />
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}
