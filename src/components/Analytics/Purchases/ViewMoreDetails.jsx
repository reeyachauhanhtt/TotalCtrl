import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

import MonthPicker from '../common/MonthPicker';
import { formatPrice } from '../../../utils/format';
import { getPersistedDateRange } from '../../../utils/analyticsDateRange';
import {
  fetchBiggestOrders,
  fetchBiggestSuppliers,
} from '../../../services/purchasesService';
import { SkeletonBar } from '../../Common/Skeleton';
import { EMPTY_STATE_LABELS } from '../../../constants/titles';

const LIMIT = 10;

const CONFIG = {
  orders: {
    title: 'Biggest Orders',
    fetcher: fetchBiggestOrders,
    tableWidth: '100%',
  },
  suppliers: {
    title: 'Biggest Suppliers',
    fetcher: fetchBiggestSuppliers,
    tableWidth: '90%',
  },
};

export default function ViewMoreDetail({ type }) {
  const navigate = useNavigate();
  const inventoryId = useSelector((s) => s.analytics.selectedInventory?.id);

  const persisted = getPersistedDateRange('analytics_date_range_purchases'); // ←  use purchases key, not a separate one
  const [dateRange, setDateRange] = useState({
    fromDate:
      persisted?.fromDate ??
      format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    toDate:
      persisted?.toDate ??
      format(endOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
  });

  const { title, fetcher, tableWidth } = CONFIG[type];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    status,
    isFetching: isLoading,
  } = useInfiniteQuery({
    queryKey: ['purchasesViewMore', type, inventoryId, dateRange],
    queryFn: ({ pageParam = 0 }) =>
      fetcher({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        limit: LIMIT,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const lastBatch = lastPage?.Data?.Data ?? [];
      if (lastBatch.length < LIMIT) return undefined;
      return allPages.reduce((acc, p) => acc + (p?.Data?.Data?.length ?? 0), 0);
    },
    enabled: !!inventoryId && !!dateRange.fromDate && !!dateRange.toDate,
    staleTime: 0,
    gcTime: 0,
  });

  const rows = data?.pages.flatMap((p) => p?.Data?.Data ?? []) ?? [];

  const handleApplyDate = useCallback(({ startDate, endDate }) => {
    setDateRange({
      fromDate: format(startDate, 'yyyy-MM-dd'),
      toDate: format(endDate, 'yyyy-MM-dd'),
    });
  }, []);

  console.log(
    'Total rows loaded:',
    rows.length,
    'Has more:',
    hasNextPage,
    'All data:',
    rows,
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 75px)',
      }}
    >
      {/* Breadcrumb */}
      <div
        className='flex items-center border-b border-[#e6e6ed]'
        style={{ padding: '0 35px', height: 54, flexShrink: 0 }}
      >
        <a
          onClick={() => navigate('/analytics')}
          className='cursor-pointer text-[14px] leading-5 font-semibold no-underline pl-5 text-black'
          style={{
            backgroundImage: `url('/img/lessthan.png')`,
            backgroundPosition: 'left center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '8px',
          }}
        >
          Purchases
        </a>
      </div>

      {/* Title + MonthPicker */}
      <div
        className='flex items-center justify-between'
        style={{ padding: '8px 35px 0 35px', flexShrink: 0 }}
      >
        <span className='pt-10 pb-10 font-semibold text-[20px] leading-7 tracking-[-0.01em] text-[#19191c] capitalize'>
          {title}
        </span>
        <MonthPicker
          onApply={handleApplyDate}
          storageKey='analytics_date_range_purchases'
        />
      </div>

      {/* Scrollable table */}
      <div
        id='purchasesViewMoreScroll'
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 35px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`#purchasesViewMoreScroll::-webkit-scrollbar { display: none; }`}</style>

        <InfiniteScroll
          dataLength={rows.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <p className='text-center text-[14px] text-[#939397] py-3'>
              Loading...
            </p>
          }
          scrollableTarget='purchasesViewMoreScroll'
          style={{ overflow: 'visible' }}
        >
          <table style={{ width: tableWidth, borderCollapse: 'collapse' }}>
            <tbody>
              {isLoading ? (
                Array.from({ length: 1 }).map((_, i) => (
                  <tr key={i}>
                    <td style={{ width: '5%', padding: '10px 0 18px 9px' }}>
                      <SkeletonBar
                        style={{ height: 10, width: 10, borderRadius: '50%' }}
                      />
                    </td>
                    <td style={{ width: '75%', padding: '10px 0 18px 7px' }}>
                      <SkeletonBar
                        style={{
                          height: 12,
                          width: 200,
                          borderRadius: 20,
                          marginBottom: 6,
                        }}
                      />
                      {type === 'orders' && (
                        <SkeletonBar
                          style={{ height: 10, width: 100, borderRadius: 20 }}
                        />
                      )}
                    </td>
                    <td style={{ width: '20%', padding: '10px 0 18px 0' }}>
                      <div className='flex justify-end'>
                        <SkeletonBar
                          style={{ height: 12, width: 80, borderRadius: 20 }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  {status === 'success' && rows.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className='text-center py-14 text-[#939397] text-[14px]'
                      >
                        {EMPTY_STATE_LABELS.NO_DATA_FOUND}
                      </td>
                    </tr>
                  )}
                  {rows.map((row, i) => (
                    <tr key={`${row.id ?? i}-${i}`}>
                      <td
                        className='text-[14px] leading-4 text-[#939397]'
                        style={{ width: '5%', padding: '10px 0 18px 9px' }}
                      >
                        {i + 1}.
                      </td>
                      <td
                        className='text-[14px] leading-4 text-[#19191c] font-normal'
                        style={{ width: '75%', padding: '10px 0 18px 7px' }}
                      >
                        {type === 'orders' ? row.supplierName : row.name}
                        {type === 'orders' && (
                          <span className='block text-[12px] text-[#6b6b6f] leading-4'>
                            #{row.number}
                          </span>
                        )}
                      </td>
                      <td
                        className='text-right text-[14px] leading-4 text-[#19191c] font-normal'
                        style={{ width: '20%', padding: '10px 0 18px 0' }}
                      >
                        {formatPrice(row.total)}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
}
