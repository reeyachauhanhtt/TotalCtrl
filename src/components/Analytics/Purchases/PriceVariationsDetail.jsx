import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import MonthPicker from '../common/MonthPicker';
import { formatPrice } from '../../../utils/format';
import { getPersistedDateRange } from '../../../utils/analyticsDateRange';
import { fetchPriceVariations } from '../../../services/purchasesService';
import { SkeletonBar } from '../../Common/Skeleton';

function PriceVariationDetailTable({ rows, isIncrease }) {
  return (
    <div className='w-1/2 pr-10'>
      <table className='w-full border-collapse'>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className='border-b border-[#e6e6ed]'>
              <td
                className='text-[14px] text-[#19191c] font-normal align-top pt-2.5 pb-4 pl-1.75'
                style={{ width: '70%' }}
              >
                {row.name}
                <span className='block text-[12px] text-[#6b6b6f] font-normal leading-4'>
                  {row.supplierName}
                </span>
              </td>
              <td
                className='text-left text-[14px] text-[#19191c] font-normal align-top pt-2.5 pb-4 pl-1.75'
                style={{ width: '30%' }}
              >
                {formatPrice(row.pricePerPurchaseUnit)}
                <label className='text-[#6b6b6f] font-normal text-[14px] leading-6 ml-2'>
                  per {row.measurementUnitName}
                </label>
                <span
                  className='block text-[12px] font-semibold uppercase tracking-[0.08em] leading-4 pl-3.75 bg-no-repeat bg-left'
                  style={{ color: isIncrease ? '#e2232e' : '#23a956' }}
                >
                  {isIncrease ? '▲' : '▼'} {row.variation?.toFixed(2)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PriceVariationDetail() {
  const navigate = useNavigate();
  const inventoryId = useSelector((s) => s.analytics.selectedInventory?.id);
  const [dateRange, setDateRange] = useState(
    getPersistedDateRange('analytics_date_range_purchases'),
  );

  const { data, isFetching: isLoading } = useQuery({
    queryKey: [
      'priceVariationDetail',
      inventoryId,
      dateRange.fromDate,
      dateRange.toDate,
    ],
    queryFn: () =>
      fetchPriceVariations({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        limit: 20,
      }),
    enabled: !!inventoryId && !!dateRange.fromDate && !!dateRange.toDate,
    staleTime: 0,
    gcTime: 0,
  });

  const increaseRows = data?.Data?.increase ?? [];
  const decreaseRows = data?.Data?.decrease ?? [];

  const handleApplyDate = useCallback(({ startDate, endDate }) => {
    setDateRange({
      fromDate: format(startDate, 'yyyy-MM-dd'),
      toDate: format(endDate, 'yyyy-MM-dd'),
    });
  }, []);

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
          Price Variations
        </span>
        <MonthPicker
          fromDate={dateRange.fromDate}
          toDate={dateRange.toDate}
          onApply={handleApplyDate}
          storageKey='analytics_date_range_purchases'
        />
      </div>

      {/* Two column scrollable area */}
      <div
        id='priceVariationDetailScroll'
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 35px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`#priceVariationDetailScroll::-webkit-scrollbar { display: none; }`}</style>
        {isLoading ? (
          <div className='flex mt-4'>
            {[0, 1].map((col) => (
              <div key={col} className='w-1/2 pr-10'>
                {Array.from({ length: 1 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      paddingTop: 10,
                      paddingBottom: 16,
                    }}
                  >
                    <div className='flex justify-between items-start'>
                      <div style={{ width: '70%' }}>
                        <SkeletonBar
                          style={{
                            height: 12,
                            width: 80,
                            borderRadius: 20,
                            marginBottom: 8,
                          }}
                        />
                        <SkeletonBar
                          style={{ height: 10, width: 50, borderRadius: 20 }}
                        />
                      </div>
                      <div style={{ width: '30%' }}>
                        <SkeletonBar
                          style={{
                            height: 12,
                            width: 80,
                            borderRadius: 20,
                            marginBottom: 8,
                          }}
                        />
                        <SkeletonBar
                          style={{ height: 10, width: 50, borderRadius: 20 }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : increaseRows.length === 0 && decreaseRows.length === 0 ? (
          <p className='text-center text-[16px] text-[#939397] py-12'>
            No data found
          </p>
        ) : (
          <div className='flex mt-4'>
            <PriceVariationDetailTable rows={increaseRows} isIncrease={true} />
            <PriceVariationDetailTable rows={decreaseRows} isIncrease={false} />
          </div>
        )}
      </div>
    </div>
  );
}
