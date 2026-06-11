import ProgressBar from '../common/ProgressBar';

export default function ItemsTransferredIn({ inventories = [] }) {
  return (
    <div className='w-1/2 mt-4'>
      {/* Title */}
      <span className='block w-full text-[18px] font-semibold tracking-[-0.01em] text-[#19191c] leading-6 my-6'>
        Analysis of items transferred{' '}
        <img
          src='/icons/arrow-right-circle.svg'
          alt=''
          className='inline align-middle'
        />{' '}
        <span className='font-semibold text-[14px] leading-5 text-[#23a956]'>
          IN
        </span>
      </span>

      {inventories.length === 0 ? (
        <p className='text-[16px] text-[#97979b]'>No result found</p>
      ) : (
        inventories.map((inv, i) => (
          <div key={i} className='w-[85%] mt-6'>
            {/* Label + value row */}
            <div className='flex justify-between'>
              <span className='text-[14px] font-normal leading-5 text-[#19191c]'>
                {inv.name} ({inv.percentage}%)
              </span>
              <span className='text-[14px] font-normal leading-5 text-[#19191c]'>
                {inv.value}
              </span>
            </div>

            {/* Progress bar */}
            <div className='mt-3'>
              <ProgressBar value={inv.percentage} fullWidth />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
