import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { format, startOfMonth, endOfMonth } from 'date-fns';

import MonthPicker from '../common/MonthPicker';
import { formatPrice } from '../../../utils/format';
import {
  fetchValueBySupplier,
  fetchValueByCategory,
  fetchCheckInValue,
  fetchCheckOutValue,
} from '../../../services/inventoryStatsService';
import { getPersistedDateRange } from '../../../utils/analyticsDateRange';
import { InventoryStatsDetailSkeleton } from './InventoryStatSkeletonLoading';

const LIMIT = 20;

const CONFIG = {
  supplier: { title: 'Value By Supplier', hasDatePicker: false },
  category: { title: 'Value by Category', hasDatePicker: false },
  checkIn: { title: 'Check IN Values', hasDatePicker: true },
  checkOut: { title: 'Check Out Values', hasDatePicker: true },
};

function fetchFn(type) {
  if (type === 'supplier') return fetchValueBySupplier;
  if (type === 'category') return fetchValueByCategory;
  if (type === 'checkIn') return fetchCheckInValue;
  return fetchCheckOutValue;
}

export default function InventoryStatsDetail({ type }) {
  const selectedInventory = useSelector((s) => s.analytics.selectedInventory);

  const navigate = useNavigate();

  const inventoryId = selectedInventory?.id;

  const today = new Date();
  const defaultRange = {
    fromDate: format(startOfMonth(today), 'yyyy-MM-dd'),
    toDate: format(endOfMonth(today), 'yyyy-MM-dd'),
  };
  const [dateRange, setDateRange] = useState(
    getPersistedDateRange() ?? defaultRange,
  );

  const { title, hasDatePicker } = CONFIG[type];
  const fetcher = fetchFn(type);

  const { data, fetchNextPage, hasNextPage, status, isLoading } =
    useInfiniteQuery({
      queryKey: ['inventoryStatsDetail', type, inventoryId, dateRange],
      queryFn: ({ pageParam = 0 }) =>
        fetcher({
          inventoryId,
          limit: LIMIT,
          offset: pageParam,
          ...(hasDatePicker ? dateRange : {}),
        }),
      getNextPageParam: (lastPage, allPages) => {
        const lastBatch = lastPage?.Data?.Data ?? [];
        if (lastBatch.length < LIMIT) return undefined;
        return allPages.reduce(
          (acc, p) => acc + (p?.Data?.Data?.length ?? 0),
          0,
        );
      },
      enabled: !!inventoryId,
      staleTime: 0,
      gcTime: 0,
    });

  const rows = data?.pages.flatMap((p) => p?.Data?.Data ?? []) ?? [];

  const handleApplyDate = useCallback((range) => {
    setDateRange({
      fromDate: format(range.startDate, 'yyyy-MM-dd'),
      toDate: format(range.endDate, 'yyyy-MM-dd'),
    });
  }, []);

  if (isLoading) return <InventoryStatsDetailSkeleton />;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 75px)',
      }}
    >
      {/* Breadcrumb — sticky */}
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
          Inventory
        </a>
      </div>

      {/* Title + MonthPicker — sticky */}
      <div
        className='flex items-center justify-between'
        style={{ padding: '8px 35px 0 35px', flexShrink: 0 }}
      >
        <span className='pt-10 pb-10 font-semibold text-[20px] leading-7 tracking-[-0.01em] text-[#19191c]'>
          {title}
        </span>
        {hasDatePicker && (
          <div className='flex items-center'>
            <MonthPicker onApply={handleApplyDate} />
          </div>
        )}
      </div>

      {/* Scrollable area — no scrollbar */}
      <div
        id='statsDetailScroll'
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 35px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`#statsDetailScroll::-webkit-scrollbar { display: none; }`}</style>

        <InfiniteScroll
          dataLength={rows.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <p className='text-center text-[14px] text-[#939397] py-3'>
              Loading...
            </p>
          }
          scrollableTarget='statsDetailScroll'
          style={{ overflow: 'visible' }}
        >
          <table style={{ width: '100%' }}>
            <tbody>
              {status === 'success' && rows.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className='text-center py-12 text-[#939397] text-[14px]'
                  >
                    No data found
                  </td>
                </tr>
              )}
              {rows.map((row, i) => (
                <tr key={`${row.name ?? row.supplierName ?? i}-${i}`}>
                  <td
                    className='text-[14px] leading-4 text-[#939397]'
                    style={{
                      width: '5%',
                      padding: '10px 0 18px 9px',
                      borderBottom: 0,
                    }}
                  >
                    {i + 1}.
                  </td>
                  <td
                    className='text-[14px] leading-4 text-[#19191c]'
                    style={{
                      width: '75%',
                      padding: '6px 0 18px 2px',
                      borderBottom: 0,
                    }}
                  >
                    {row.name ?? row.supplierName ?? '—'}
                  </td>
                  <td
                    className='text-right text-[14px] leading-4 text-[#19191c]'
                    style={{
                      width: '20%',
                      padding: '10px 150px 18px 0',
                      borderBottom: 0,
                    }}
                  >
                    {formatPrice(row.total ?? row.value ?? 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
}
