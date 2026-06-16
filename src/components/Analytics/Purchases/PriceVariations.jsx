import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { fetchPriceVariations } from '../../../services/purchasesService';
import { formatPrice } from '../../../utils/format';
import { SkeletonBar } from '../../Common/Skeleton';

function PriceVariationTable({
  title,
  rows = [],
  onViewMore,
  isIncrease,
  isLoading = false,
}) {
  const inventoryId = useSelector((s) => s.analytics.selectedInventory?.id);

  return (
    <div className='w-1/2 pr-10'>
      <table className='w-full border-collapse'>
        <thead>
          <tr className='border-b-0'>
            <th colSpan={2} className='h-12 text-left border-b-0'>
              <label className='text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6f] ml-2'>
                {title}
              </label>
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td
                    className='align-top pt-1 pb-1.5 pl-1.75'
                    style={{ width: '74%' }}
                  >
                    <SkeletonBar
                      style={{
                        height: 12,
                        width: 100,
                        borderRadius: 20,
                        // marginBottom: 8,
                      }}
                    />
                    <SkeletonBar
                      style={{ height: 12, width: 50, borderRadius: 20 }}
                    />
                  </td>
                  <td
                    className='align-top pt-1 pb-1.5'
                    style={{ width: '26%' }}
                  >
                    <div className='flex flex-col items-end'>
                      <SkeletonBar
                        style={{ height: 12, width: 100, borderRadius: 20 }}
                      />
                      <SkeletonBar
                        style={{
                          height: 12,
                          width: 50,
                          borderRadius: 20,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            : rows.map((row) => (
                <tr
                  key={row.id}
                  className='border-b border-[#e7e7ec] last:border-b-0'
                >
                  <td
                    className='text-[14px] text-[#19191c] font-normal align-top pt-6.75 pb-5 pl-1.75'
                    style={{ width: '74%' }}
                  >
                    {row.name}
                    <span className='block text-[14px] text-[#6b6b6f] font-normal leading-4'>
                      {row.supplierName}
                    </span>
                  </td>
                  <td
                    className='text-right text-[14px] text-[#19191c] font-normal align-top pt-6.75 pb-5 pl-1.75'
                    style={{ width: '26%' }}
                  >
                    {formatPrice(row.pricePerPurchaseUnit)}
                    <label className='text-[#6b6b6f] font-normal text-[14px] leading-6 ml-2'>
                      per {row.measurementUnitName}
                    </label>
                    <div>
                      <span
                        className='inline-block text-[12px] font-bold uppercase tracking-[0.08em] leading-4 pl-3.75 bg-no-repeat bg-left'
                        style={{ color: isIncrease ? '#e2232e' : '#23a956' }}
                      >
                        {isIncrease ? '▲' : '▼'} {row.variation?.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {onViewMore && (
        <div
          className='text-center text-[14px] bg-[#f4faf6] py-3 font-bold text-[#1f8e4e] tracking-[0.04em] cursor-pointer mt-2'
          onClick={onViewMore}
        >
          View more
        </div>
      )}
    </div>
  );
}

export default function PriceVariations({ inventoryId, dateRange }) {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: [
      'priceVariations',
      inventoryId,
      dateRange.fromDate,
      dateRange.toDate,
    ],
    queryFn: () =>
      fetchPriceVariations({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        limit: 8,
      }),
    enabled: !!inventoryId && !!dateRange.fromDate && !!dateRange.toDate,
    staleTime: 0,
    gcTime: 0,
  });

  const increase = data?.Data?.increase ?? data?.data?.increase ?? [];
  const decrease = data?.Data?.decrease ?? data?.data?.decrease ?? [];
  const increaseRows = increase.slice(0, 4);
  const decreaseRows = decrease.slice(0, 4);
  const increaseHasMore = increase.length >= 4;
  const decreaseHasMore = decrease.length >= 4;

  console.log('priceVariations raw data:', data);
  return (
    <div className='flex w-[95%] mt-2.5'>
      <PriceVariationTable
        title='Price Variations'
        rows={increaseRows}
        isIncrease={true}
        isLoading={isLoading}
        onViewMore={
          increaseHasMore ? () => navigate('/analytics/pricevariation') : null
        }
      />
      <PriceVariationTable
        title=''
        rows={decreaseRows}
        isIncrease={false}
        isLoading={isLoading}
        onViewMore={
          decreaseHasMore ? () => navigate('/analytics/pricevariation') : null
        }
      />
    </div>
  );
}
