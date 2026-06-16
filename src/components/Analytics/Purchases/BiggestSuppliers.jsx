import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { fetchBiggestSuppliers } from '../../../services/purchasesService';
import { formatPrice } from '../../../utils/format';
import { SkeletonBar } from '../../Common/Skeleton';

export default function BiggestSuppliers({ inventoryId, dateRange }) {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: [
      'biggestSuppliers',
      inventoryId,
      dateRange.fromDate,
      dateRange.toDate,
    ],
    queryFn: () =>
      fetchBiggestSuppliers({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        limit: 6,
      }),
    staleTime: 0,
    gcTime: 0,
    enabled: !!inventoryId && !!dateRange.fromDate && !!dateRange.toDate,
  });

  const suppliers = data?.Data?.Data ?? [];
  const displaySuppliers = suppliers.slice(0, 5);
  const hasMore = suppliers.length >= 5;

  return (
    <div className='w-1/2 pr-10'>
      <table className='w-full border-collapse'>
        <thead>
          <tr className='border-b-0'>
            <th colSpan={2} className='h-12 text-left border-b-0'>
              <label className='text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6f] ml-2'>
                Biggest Suppliers
              </label>
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className='w-4/5 align-top pt-1.75 pb-2 pl-1.75'>
                    <SkeletonBar
                      style={{ height: 12, width: 100, borderRadius: 20 }}
                    />
                  </td>

                  <td className='w-1/5 align-top pt-2 pb-2'>
                    <div className='flex justify-end'>
                      <SkeletonBar
                        style={{ height: 12, width: 50, borderRadius: 20 }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            : displaySuppliers.map((row) => (
                <tr
                  key={row.id}
                  className='border-b border-[#e7e7ec] last:border-b-0'
                >
                  <td className='w-4/5 text-[14px] text-[#19191c] font-normal align-top pt-6.75 pb-5 pl-1.75'>
                    {row.name}
                  </td>
                  <td className='w-1/5 text-right text-[14px] text-[#19191c] font-normal align-top pt-6.75 pb-5'>
                    {formatPrice(row.total)}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {hasMore && (
        <div
          className='text-center text-[14px] bg-[#f4faf6] py-3 font-bold text-[#1f8e4e] tracking-[0.04em] cursor-pointer mt-2'
          onClick={() => navigate('/analytics/biggestsuppliers')}
        >
          View more
        </div>
      )}
    </div>
  );
}
