// src/features/analytics/FoodWaste/OtherReasonTooltip.jsx

export default function OtherReasonTooltip({ reasons, onSeeDetails }) {
  // reasons: [{ label: 'Uncategorised', value: 0.29, percent: 24 }]

  return (
    <div
      className='absolute bg-white'
      style={{
        bottom: 'calc(100% + 10px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 5000,
        width: 320,
        borderRadius: 12,
        boxShadow:
          'rgba(25,25,28,0.14) 0px 8px 32px, rgba(25,25,28,0.07) 0px 1.5px 4px',
        padding: '16px 18px 14px',
        border: '1px solid #ebebeb',
        pointerEvents: 'auto',
      }}
    >
      {/* Arrow */}
      <div
        className='absolute bg-white'
        style={{
          bottom: -7,
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          width: 12,
          height: 12,
          border: '1px solid #ebebeb',
          borderTop: 'none',
          borderLeft: 'none',
        }}
      />

      {/* Title */}
      <p
        className='text-[#8a8a8e] font-bold uppercase'
        style={{ margin: '0 0 12px', fontSize: 12, letterSpacing: '0.07em' }}
      >
        Top 3 other reasons
      </p>

      {/* List */}
      <div className='flex flex-col' style={{ gap: 10 }}>
        {(reasons ?? []).map((r, i) => (
          <div key={i}>
            <div
              className='flex justify-between items-baseline'
              style={{ marginBottom: 4 }}
            >
              <span
                className='font-semibold text-[#19191c]'
                style={{ fontSize: 13, maxWidth: 190, lineHeight: 1.3 }}
              >
                {r.label}
              </span>
              <span
                className='text-[#8a8a8e] whitespace-nowrap'
                style={{ fontSize: 12, marginLeft: 8 }}
              >
                {r.value}
              </span>
            </div>
            <div className='flex items-center' style={{ gap: 8 }}>
              <div className='flex-1 min-w-0'>
                <svg
                  viewBox='0 0 100 2'
                  preserveAspectRatio='none'
                  style={{ width: '100%', overflow: 'hidden' }}
                >
                  <path
                    d='M 1,1 L 99,1'
                    strokeLinecap='round'
                    stroke='#ECECEF'
                    strokeWidth='2'
                    fillOpacity='0'
                  />
                  <path
                    d='M 1,1 L 99,1'
                    strokeLinecap='round'
                    stroke='#1F8E4E'
                    strokeWidth='2'
                    fillOpacity='0'
                    style={{
                      strokeDasharray: `${r.percent}, 100`,
                      strokeDashoffset: '0px',
                      transition:
                        'stroke-dashoffset 0.3s, stroke-dasharray 0.3s, stroke 0.3s linear, 0.06s',
                    }}
                  />
                </svg>
              </div>
              <span
                className='text-[#8a8a8e] text-right'
                style={{ fontSize: 11, minWidth: 32 }}
              >
                {r.percent}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Button */}
      <button
        onClick={onSeeDetails}
        className='w-full text-white font-bold cursor-pointer'
        style={{
          marginTop: 14,
          padding: '8px 0',
          background: '#1f8e4e',
          border: 'none',
          borderRadius: 7,
          fontSize: 13,
        }}
      >
        See details →
      </button>
    </div>
  );
}
