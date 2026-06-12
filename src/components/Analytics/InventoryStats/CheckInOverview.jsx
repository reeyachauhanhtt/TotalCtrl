import MonthPicker from '../common/MonthPicker';
import { formatPrice } from '../../../utils/format';
import { SkeletonBar } from '../../Common/Skeleton';

export default function CheckInOverview({
  total = 0,
  rows = [],
  onApplyDateRange,
  onViewMore,
  isLoading = false,
}) {
  const hasData = total > 0 && rows.length > 0;
  const displayRows = rows.slice(0, 3);
  const hasMore = rows.length > 3;

  return (
    <div className='w-full'>
      {/* Title + Picker */}
      <div className='flex items-center justify-between'>
        <span className='text-[16px] font-normal text-[#19191c]'>Check in</span>
        <MonthPicker onApply={onApplyDateRange} singleMonth />
      </div>

      {/* Total */}
      {hasData && (
        <div className='mt-3 mb-6'>
          <span className='text-[24px] font-medium leading-8 text-[#19191c]'>
            {formatPrice(total)}
          </span>
        </div>
      )}

      {/* Empty state */}
      {!hasData && (
        <div className='text-center px-12 pt-9 pb-6 mt-0'>
          <div className='mb-4'>
            <img
              src='/icons/InventoryIllustration.svg'
              style={{ width: 151, height: 108 }}
              className='inline-block'
              alt=''
            />
          </div>
          <ul className='list-none p-0 m-0 text-center'>
            <span
              className='block font-medium text-[#19191c]'
              style={{ fontSize: 24, lineHeight: '32px' }}
            >
              No check ins
            </span>
            <li
              className='text-[#97979b] text-[16px] leading-6'
              style={{ marginTop: 8 }}
            >
              There hasn't been any delivery made during the selected time
              range.
            </li>
          </ul>
        </div>
      )}

      {/* Rows */}
      {hasData && (
        <>
          <table className='w-full border-collapse'>
            <tbody>
              {displayRows.map((row, i) => (
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
                    + {formatPrice(row.total)}
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
        </>
      )}
    </div>
  );
}
