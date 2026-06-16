import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

import { getPersistedDateRange } from '../../../utils/analyticsDateRange';
import { formatPrice } from '../../../utils/format';
import MonthPicker from '../common/MonthPicker';
import ExportButton from '../common/ExportButton';
import GreenButton from '../../common/GreenButton';
import {
  fetchTotalReturnedGoods,
  fetchSupplierRanking,
} from '../../../services/deliveryStatsService';
import { SkeletonBar } from '../../Common/Skeleton';

export default function DeliveryStats() {
  const navigate = useNavigate();

  const persisted = getPersistedDateRange(
    'analytics_date_range_delivery_stats',
  );
  const [dateRange, setDateRange] = useState({
    fromDate:
      persisted?.fromDate ??
      format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    toDate:
      persisted?.toDate ??
      format(endOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
  });

  const inventoryId = useSelector((s) => s.analytics.selectedInventory?.id);

  const { data, isLoading: isTotalLoading } = useQuery({
    queryKey: [
      'totalReturnedGoods',
      inventoryId,
      dateRange.fromDate,
      dateRange.toDate,
    ],
    queryFn: () =>
      fetchTotalReturnedGoods({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
      }),
    enabled: !!inventoryId && !!dateRange.fromDate && !!dateRange.toDate,
    staleTime: 0,
    gcTime: 0,
  });

  const { data: supplierData, isLoading: isSupplierLoading } = useQuery({
    queryKey: [
      'supplierRanking',
      inventoryId,
      dateRange.fromDate,
      dateRange.toDate,
    ],
    queryFn: () =>
      fetchSupplierRanking({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
      }),
    enabled: !!inventoryId && !!dateRange.fromDate && !!dateRange.toDate,
    staleTime: 0,
    gcTime: 0,
  });

  const total = data?.Data?.total ?? 0;
  const suppliers = supplierData?.Data ?? [];

  const isLoading = isTotalLoading || isSupplierLoading;
  const isEmpty = !isLoading && total === 0;

  function handleDateApply({ startDate, endDate, label }) {
    setDateRange({ fromDate: startDate, toDate: endDate, label });
  }

  return (
    <div className='px-8.75 pb-15 pr-10'>
      {/* Header */}
      <div className='flex justify-between items-start mt-9.5'>
        <span className='text-[20px] font-semibold text-[#19191c] tracking-[-0.01em] leading-7'>
          Delivery Stats
        </span>
        <div className='flex items-center gap-5'>
          <ExportButton disabled={isEmpty} />
          <MonthPicker
            fromDate={dateRange.fromDate}
            toDate={dateRange.toDate}
            label={dateRange.label}
            onApply={handleDateApply}
            storageKey='analytics_date_range_delivery_stats'
          />
        </div>
      </div>

      {isEmpty ? (
        /* Empty state */
        <div className='h-125 w-full flex flex-col justify-center items-center'>
          <img
            src='/icons/InventoryIllustration.svg'
            alt=''
            style={{ height: 108, width: 151 }}
          />
          <span className='text-[24px] font-semibold text-[#19191c] tracking-[-0.01em] leading-8 text-center mt-6'>
            No returned goods
          </span>
          <div className='flex justify-center mt-4 mb-4 w-2/3'>
            <ul className='text-[16px] text-[#97979b] text-center font-normal tracking-[-0.16px]'>
              <li>
                We can't show any useful information without orders. Please add
                a
              </li>
              <li> new one using the button below.</li>
            </ul>
          </div>
          <div className='mt-4'>
            <GreenButton onClick={() => navigate('/external-orders')}>
              <img src='/icons/upload.svg' alt='' width={20} height={20} />
              Add order with receipt
            </GreenButton>
          </div>
        </div>
      ) : (
        <>
          {/* Value of Returned Goods */}
          <div className='mt-12'>
            <label className='block text-[12px] font-bold text-[#6b6b6f] tracking-[0.08em] uppercase'>
              Value Of Returned Goods
            </label>

            {isLoading ? (
              <SkeletonBar
                style={{
                  height: 56,
                  width: 280,
                  borderRadius: 20,
                  marginTop: 16,
                }}
              />
            ) : (
              <span className='block text-[64px] font-medium text-[#19191c] tracking-[-0.01em] leading-16 mt-4'>
                {formatPrice(total)}
              </span>
            )}
          </div>

          {/* Supplier Ranking */}
          <div className='mt-10'>
            <table className='w-full'>
              <thead>
                <tr>
                  <th colSpan={3} className='h-12 text-left pl-0'>
                    <label className='text-[12px] font-semibold text-[#6b6b6f] tracking-[0.08em] uppercase'>
                      Supplier Ranking
                    </label>
                  </th>
                </tr>
              </thead>
            </table>

            {isLoading ? (
              <div className='flex gap-10 mt-2'>
                {[{ width: '20%' }, { width: '30%' }, { width: '20%' }].map(
                  (col, colIdx) => (
                    <div
                      key={colIdx}
                      className='flex flex-col gap-4'
                      style={{ flex: 1 }}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <SkeletonBar
                          key={i}
                          style={{
                            height: 14,
                            width: col.width,
                            borderRadius: 20,
                          }}
                        />
                      ))}
                    </div>
                  ),
                )}
              </div>
            ) : suppliers.length === 0 ? (
              <p className='text-center text-[#6b6b6f] text-[16px] mt-2'>
                No data found
              </p>
            ) : (
              <table className='w-full'>
                <tbody>
                  {suppliers.map((supplier, i) => (
                    <tr key={i}>
                      <td>{supplier.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
