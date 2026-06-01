import ProgressBar from '../common/ProgressBar';

export default function InventoryCard({
  variant = 'realtime',
  item,
  onViewDetails,
}) {
  const hasValue =
    item?.value && item.value !== '0,00' && item.value !== '0,00 kr';

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
      }}
    >
      {/* Name — font-size:18px font-weight:600 letter-spacing:-.01em color:#19191c mb-24px */}
      <p
        className='font-semibold block w-full'
        style={{
          fontSize: 15,
          letterSpacing: '-0.01em',
          color: '#19191c',
          marginBottom: 18,
        }}
      >
        {item?.name}
      </p>

      {/* Price — font-size:32px font-weight:600 letter-spacing:-.01em color:#19191c */}
      <p
        className='font-extrabold!'
        style={{
          fontSize: 26,
          letterSpacing: '-0.01em',
          color: '#19191c',
          marginBottom: '0.20rem',
        }}
      >
        {item?.value}
      </p>

      {/* Description — font-size:12px font-weight:400 line-height:16px color:#6b6b6f */}
      <p
        className='font-normal'
        style={{
          fontSize: 10,
          lineHeight: '16px',
          color: '#6b6b6f',
          marginBottom: '0.40rem',
        }}
      >
        {item?.description}
      </p>

      {/* realtime & purchases — progress bar mt-1 */}
      {variant !== 'foodusage' && (
        <div style={{ marginTop: 4 }}>
          <ProgressBar value={item?.progress ?? 0} />
        </div>
      )}

      {/* foodusage — 2 rows */}
      {variant === 'foodusage' && (
        <div className='w-full' style={{ marginTop: 30 }}>
          {/* Used food row */}
          <div className='flex w-full'>
            <span
              className='font-normal'
              style={{
                width: '60%',
                fontSize: 11,
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
                fontSize: 11,
                lineHeight: '20px',
                color: '#19191c',
              }}
            >
              {item?.usedFoodValue}
            </span>
          </div>
          <div className='w-full' style={{ marginTop: 4 }}>
            <ProgressBar value={item?.usedFoodProgress ?? 0} fullWidth />
          </div>

          {/* Food waste row */}
          <div className='flex w-full' style={{ marginTop: 24 }}>
            <span
              className='font-normal'
              style={{
                width: '60%',
                fontSize: 11,
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
                fontSize: 11,
                lineHeight: '20px',
                color: '#19191c',
              }}
            >
              {item?.foodWasteValue}
            </span>
          </div>
          <div className='w-full' style={{ marginTop: 4 }}>
            <ProgressBar value={item?.foodWasteProgress ?? 0} fullWidth />
          </div>
        </div>
      )}

      {/* View details — mt-33px font-size:14px font-weight:600 color:#1f8e4e */}
      <div
        onClick={hasValue ? onViewDetails : undefined}
        className='flex items-center font-semibold'
        style={{
          marginTop: 33,
          fontSize: 12,
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
