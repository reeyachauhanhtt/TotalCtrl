import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { fetchBiggestOrders } from '../../../services/purchasesService';
import { formatPrice } from '../../../utils/format';
import { SkeletonBar } from '../../Common/Skeleton';

export default function BiggestOrders({ inventoryId, dateRange }) {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: [
      'biggestOrders',
      inventoryId,
      dateRange.fromDate,
      dateRange.toDate,
    ],
    queryFn: () =>
      fetchBiggestOrders({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        limit: 4,
      }),
    enabled: !!inventoryId && !!dateRange.fromDate && !!dateRange.toDate,
    staleTime: 0,
    gcTime: 0,
  });

  const orders = data?.Data?.Data ?? [];
  const displayOrders = orders.slice(0, 3);
  const hasMore = orders.length >= 3;

  return (
    <div className='w-1/2 pr-10'>
      <table className='w-full border-collapse'>
        <thead>
          <tr className='border-b-0'>
            <th colSpan={2} className='h-12 text-left border-b-0'>
              <label className='text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6f] ml-2'>
                Biggest Orders
              </label>
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td className='w-4/5 align-top pl-1.75 pt-1 pb-1.5'>
                    <SkeletonBar
                      style={{
                        height: 12,
                        width: 100,
                        borderRadius: 20,
                        // marginBottom: 2,
                      }}
                    />
                    <SkeletonBar
                      style={{ height: 12, width: 100, borderRadius: 20 }}
                    />
                  </td>
                  <td className='w-1/5 align-top pt-1'>
                    <div className='flex flex-col items-end'>
                      <SkeletonBar
                        style={{ height: 12, width: 50, borderRadius: 20 }}
                      />
                      {/* <SkeletonBar
                        style={{ height: 12, width: 70, borderRadius: 20 }}
                      /> */}
                    </div>
                  </td>
                </tr>
              ))
            : displayOrders.map((row) => (
                <tr
                  key={row.id}
                  className='border-b border-[#e7e7ec] last:border-b-0'
                >
                  <td className='w-4/5 text-[14px] text-[#19191c] font-normal align-top pt-6.75 pb-5 pl-1.75'>
                    {row.supplierName}
                    <span className='block text-[14px] text-[#6b6b6f] font-normal leading-4'>
                      {row.number}
                    </span>
                  </td>
                  <td className='w-1/5 text-right text-[14px] text-[#19191c] font-normal align-top pt-6.75 pb-5'>
                    {formatPrice(row.total)}
                    <span className='block'>
                      <button
                        // onClick={() => navigate(`/external-orders`)}
                        onClick={() =>
                          navigate(`/external-orders/${row.slug}/${row.id}`, {
                            state: { from: 'analytics' },
                          })
                        }
                        className='text-[14px] font-bold text-[#1f8e4e] leading-4 cursor-pointer bg-transparent border-0 p-0'
                      >
                        View details
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {hasMore && (
        <div
          className='text-center text-[14px] bg-[#f4faf6] py-3 font-bold text-[#1f8e4e] tracking-[0.04em] cursor-pointer mt-2'
          onClick={() => navigate('/analytics/biggestorders')}
        >
          View more
        </div>
      )}
    </div>
  );
}
