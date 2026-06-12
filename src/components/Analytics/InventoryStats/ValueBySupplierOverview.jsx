import { formatPrice } from '../../../utils/format';
import { SkeletonBar } from '../../Common/Skeleton';

export default function ValueBySupplierOverview({
  rows = [],
  onViewMore,
  isLoading = false,
}) {
  const displayRows = rows.slice(0, 3);
  const hasMore = rows.length > 3;

  return (
    <div className='w-full'>
      <table className='w-full border-collapse'>
        <thead>
          <tr>
            <th className='text-left h-12 border-b-0 p-0 pb-2'>
              <label className='font-semibold text-[12px] leading-4 tracking-[0.08em] uppercase text-[#6b6b6f] ml-2'>
                Value by Supplier
              </label>
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <tr
                  key={i}
                  className={i < 2 ? 'border-b border-[#e7e7ec]' : ''}
                >
                  <td className='w-4/5 pt-6.75 pb-5 pl-1.75'>
                    <SkeletonBar
                      style={{ height: 12, width: 160, borderRadius: 8 }}
                    />
                  </td>
                  <td className='w-1/5 pt-6.75 pb-5 pl-1.75'>
                    <SkeletonBar
                      style={{
                        height: 12,
                        width: 70,
                        borderRadius: 8,
                        marginLeft: 'auto',
                      }}
                    />
                  </td>
                </tr>
              ))
            : displayRows.map((row, i) => (
                <tr
                  key={row.id || i}
                  className={
                    i === displayRows.length - 1
                      ? ''
                      : 'border-b border-[#e7e7ec]'
                  }
                >
                  <td className='w-4/5 font-normal text-[14px] leading-4 text-[#19191c] pt-6.75 pb-5 pl-1.75'>
                    {row.name}
                  </td>
                  <td className='w-1/5 text-right font-normal text-[14px] leading-4 text-[#19191c] pt-6.75 pb-5 pl-1.75'>
                    {formatPrice(row.total)}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {hasMore && (
        <div
          onClick={onViewMore}
          className='text-center text-[14px] bg-[#f4faf6] py-3 font-bold text-[#1f8e4e] tracking-[0.04em] cursor-pointer mt-2'
        >
          View more
        </div>
      )}
    </div>
  );
}
