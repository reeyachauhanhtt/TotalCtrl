import ProgressBar from '../common/ProgressBar';
import { SkeletonBar } from '../../Common/Skeleton';
import { EMPTY_STATE_LABELS } from '../../../constants/titles';

export default function ItemsTransferredOut({
  inventories = [],
  isLoading = false,
}) {
  return (
    <div className='w-1/2 mt-4'>
      <span className='block w-full text-[18px] font-semibold tracking-[-0.01em] text-[#19191c] leading-6 my-6'>
        Analysis of items transferred{' '}
        <img
          src='/icons/arrow-left-circle.svg'
          alt=''
          className='inline align-middle'
        />{' '}
        <span className='font-semibold text-[14px] leading-5 text-[#e2232e]'>
          OUT
        </span>
      </span>

      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='w-[85%] mt-6'>
            <div className='flex justify-between'>
              <SkeletonBar
                style={{ height: 20, width: 100, borderRadius: 20 }}
              />
              <SkeletonBar
                style={{ height: 20, width: 100, borderRadius: 20 }}
              />
            </div>
            <SkeletonBar
              style={{
                height: 8,
                width: '100%',
                borderRadius: 20,
                marginTop: 12,
              }}
            />
          </div>
        ))
      ) : inventories.length === 0 ? (
        <p className='text-[16px] text-[#97979b]'>
          {' '}
          {EMPTY_STATE_LABELS.NO_RESULT_FOUND}
        </p>
      ) : (
        inventories.map((inv, i) => (
          <div key={i} className='w-[85%] mt-6'>
            <div className='flex justify-between'>
              <span className='text-[14px] font-normal leading-5 text-[#19191c]'>
                {inv.name} ({inv.percentage}%)
              </span>
              <span className='text-[14px] font-normal leading-5 text-[#19191c]'>
                {inv.value}
              </span>
            </div>
            <div className='mt-3'>
              <ProgressBar value={inv.percentage} fullWidth />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
