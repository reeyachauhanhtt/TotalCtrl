import { SkeletonBar } from '../../../components/Common/Skeleton';
import ProgressBar from '../common/ProgressBar';

export default function InventoryCard({
  variant = 'realtime',
  item,
  onViewDetails,
  isLoading = false,
}) {
  const hasValue =
    item?.value && item.value !== '0,00' && item.value !== '0,00 kr';

  const wrapperStyle = {
    width: variant === 'foodusage' ? '33.333%' : '25%',
    padding:
      variant === 'foodusage' ? '40px 56px 40px 58px' : '40px 5px 40px 58px',
    borderRight: '1px solid #e7e7ec',
    borderBottom: '1px solid #e7e7ec',
    boxSizing: 'border-box',
    minHeight: variant === 'foodusage' ? 400 : 'auto',
  };

  if (isLoading) {
    return (
      <div className='flex flex-col box-border' style={wrapperStyle}>
        <SkeletonBar
          style={{ height: 24, width: 90, borderRadius: 10, marginBottom: 18 }}
        />
        <SkeletonBar
          style={{ height: 40, width: 120, borderRadius: 12, marginBottom: 0 }}
        />
        <SkeletonBar
          style={{ height: 14, width: 150, borderRadius: 50, marginBottom: 6 }}
        />

        {variant === 'foodusage' && (
          <div className='w-full' style={{ marginTop: 30 }}>
            <div className='flex justify-between w-full'>
              <SkeletonBar
                style={{ height: 20, width: 100, borderRadius: 10 }}
              />
              <SkeletonBar
                style={{ height: 20, width: 90, borderRadius: 10 }}
              />
            </div>
            <SkeletonBar style={{ height: 8, borderRadius: 4, marginTop: 8 }} />

            <div
              className='flex justify-between w-full'
              style={{ marginTop: 24 }}
            >
              <SkeletonBar
                style={{ height: 20, width: 100, borderRadius: 10 }}
              />
              <SkeletonBar
                style={{ height: 20, width: 90, borderRadius: 10 }}
              />
            </div>
            <SkeletonBar style={{ height: 8, borderRadius: 4, marginTop: 8 }} />
          </div>
        )}

        {variant !== 'foodusage' && (
          <SkeletonBar
            style={{ height: 12, width: 260, borderRadius: 50, marginTop: 2 }}
          />
        )}

        <SkeletonBar
          style={{ height: 24, width: 100, borderRadius: 8, marginTop: 40 }}
        />
      </div>
    );
  }

  return (
    <div
      className='flex flex-col box-border'
      style={{
        width: variant === 'foodusage' ? '33.333%' : '25%',
        padding:
          variant === 'foodusage'
            ? '40px 56px 40px 58px'
            : '40px 5px 40px 58px',
        borderRight: '1px solid #e7e7ec',
        borderBottom: '1px solid #e7e7ec',
        boxSizing: 'border-box',
        minHeight: variant === 'foodusage' ? 400 : 'auto',
      }}
    >
      <p
        className='font-semibold block w-full'
        style={{
          fontSize: 18,
          letterSpacing: '-0.01em',
          color: '#19191c',
          marginBottom: 18,
        }}
      >
        {item?.name}
      </p>

      <p
        className='font-semibold'
        style={{
          fontSize: 32,
          letterSpacing: '-0.01em',
          color: '#19191c',
          marginBottom: '0.20rem',
        }}
      >
        {item?.value}
      </p>

      <p
        className='font-normal'
        style={{
          fontSize: 12,
          lineHeight: '16px',
          color: '#6b6b6f',
          marginBottom: '0.40rem',
        }}
      >
        {item?.description}
      </p>

      {variant !== 'foodusage' && (
        <div style={{ marginTop: 4 }}>
          <ProgressBar value={item?.progress ?? 0} />
        </div>
      )}

      {variant === 'foodusage' && (
        <div className='w-full' style={{ marginTop: 30 }}>
          <div className='flex w-full'>
            <span
              className='font-normal'
              style={{
                width: '60%',
                fontSize: 14,
                lineHeight: '20px',
                color: '#19191c',
              }}
            >
              {item?.usedFoodLabel}
            </span>
            <span
              className='font-normal text-right'
              style={{
                width: '40%',
                fontSize: 14,
                lineHeight: '20px',
                color: '#19191c',
              }}
            >
              {item?.usedFoodValue}
            </span>
          </div>
          <div className='w-full' style={{ marginTop: 8 }}>
            <ProgressBar value={item?.usedFoodProgress ?? 0} fullWidth />
          </div>

          {/* Food waste row */}
          <div className='flex w-full' style={{ marginTop: 24 }}>
            <span
              className='font-normal'
              style={{
                width: '60%',
                fontSize: 14,
                lineHeight: '20px',
                color: '#19191c',
              }}
            >
              {item?.foodWasteLabel}
            </span>
            <span
              className='font-normal text-right'
              style={{
                width: '40%',
                fontSize: 14,
                lineHeight: '20px',
                color: '#19191c',
              }}
            >
              {item?.foodWasteValue}
            </span>
          </div>
          <div className='w-full' style={{ marginTop: 8 }}>
            <ProgressBar value={item?.foodWasteProgress ?? 0} fullWidth />
          </div>
        </div>
      )}

      <div
        onClick={hasValue ? onViewDetails : undefined}
        className='flex items-center'
        style={{
          marginTop: 52,
          fontSize: 14,
          fontWeight: 600,
          color: 'rgb(31, 142, 78)',
          opacity: hasValue ? 1 : 0.5,
          cursor: hasValue ? 'pointer' : 'not-allowed',
          gap: 6,
        }}
      >
        View details
        <svg width='6' height='10' viewBox='0 0 6 10' fill='none'>
          <path
            d='M1 1l4 4-4 4'
            stroke='rgb(31,142,78)'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>
    </div>
  );
}
