import { createPortal } from 'react-dom';
import { formatPrice } from '../../../utils/format';

export default function OtherReasonModal({ onClose, data }) {
  return createPortal(
    <div
      className='fixed inset-0 flex items-center justify-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 10050 }}
      onClick={onClose}
    >
      <div
        className='relative bg-white'
        style={{
          maxWidth: 550,
          width: '92%',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 12px 48px rgba(25,25,28,0.12)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ position: 'relative', padding: '24px 56px 8px 28px' }}>
          {/* Close button */}
          <button
            onClick={onClose}
            className='absolute flex items-center justify-center bg-[#fafafa]'
            style={{
              top: 20,
              right: 20,
              width: 36,
              height: 36,
              border: '1px solid #ebebeb',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            <img
              src='/icons/closepopup-icon.svg'
              alt=''
              width={14}
              height={14}
            />
          </button>

          {/* Title */}
          <h2
            className='text-[#19191c] font-bold'
            style={{
              margin: '0 0 8px',
              fontSize: 20,
              lineHeight: 1.25,
              paddingRight: 8,
            }}
          >
            Other Reasons – Breakdown
          </h2>

          {/* Subtitle */}
          <p
            className='text-[#8a8a8e]'
            style={{ fontSize: 14, lineHeight: 1.45 }}
          >
            {data?.totalLogs ?? 0} waste logs ·{' '}
            <span className='font-medium'>
              {formatPrice(data?.totalValue ?? 0)}
            </span>{' '}
            total · {data?.dateLabel ?? ''}
          </p>

          {/* Insight */}
          <div
            className='flex items-center text-[#19734a]'
            style={{
              gap: 10,
              padding: '12px 14px',
              marginTop: 20,
              background: '#eaf7ee',
              border: '1px solid #b8e0c8',
              borderRadius: 10,
              fontSize: 13,
              lineHeight: 1.45,
            }}
          >
            <span
              className='inline-flex'
              style={{ width: 18, height: 18, minWidth: 18 }}
            >
              <img src='/icons/bulb-icon.svg' alt='' width={18} height={18} />
            </span>
            <span className='font-medium' style={{ fontSize: 14 }}>
              <span className='font-bold'>{data?.insightName ?? ''}</span>{' '}
              <span>{data?.insightText ?? ''}</span>
            </span>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            padding: '20px 28px 28px',
            maxHeight: 'min(70vh, 540px)',
            overflowY: 'auto',
          }}
        >
          {(data?.reasons ?? []).map((r, i) => (
            <div
              key={i}
              style={{
                paddingTop: i === 0 ? 0 : 20,
                paddingBottom: 14,
                borderBottom: '1px solid #ebebeb',
              }}
            >
              {/* Row head */}
              <div
                className='flex justify-between items-center'
                style={{ gap: 12, marginBottom: 8 }}
              >
                <div
                  className='flex items-center flex-1 min-w-0'
                  style={{ gap: 10 }}
                >
                  <div
                    className='flex items-center justify-center font-bold'
                    style={{
                      width: 20,
                      height: 20,
                      minWidth: 20,
                      borderRadius: '50%',
                      background: r.value === 0 ? '#c4c4c8' : '#1f8e4e',
                      color: '#fff',
                      fontSize: 11,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span
                    className='font-semibold text-[#19191c] truncate'
                    style={{ fontSize: 15, lineHeight: 1.2 }}
                  >
                    {r.label}
                  </span>
                </div>
                <span
                  className='font-bold text-[#19191c] whitespace-nowrap'
                  style={{ fontSize: 14 }}
                >
                  {formatPrice(r.value)}{' '}
                  <span
                    className='font-medium text-[#8a8a8e]'
                    style={{ fontSize: 12, marginLeft: 5 }}
                  >
                    {r.percent}%
                  </span>
                </span>
              </div>

              {/* Bar + logs */}
              <div
                className='flex items-center'
                style={{ gap: 10, marginTop: 4 }}
              >
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
                      stroke={r.value === 0 ? '#c4c4c8' : '#1F8E4E'}
                      strokeWidth='2'
                      fillOpacity='0'
                      style={{
                        strokeDasharray: `${r.percent}, 100`,
                        strokeDashoffset: '0px',
                        transition:
                          'stroke-dashoffset 0.3s, stroke-dasharray 0.3s, stroke 0.3s linear',
                      }}
                    />
                  </svg>
                </div>
                <div
                  className='text-[#8a8a8e] text-right whitespace-nowrap'
                  style={{ minWidth: 48, fontSize: 13, lineHeight: 1.1 }}
                >
                  {r.logs} log{r.logs !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          ))}

          {/* Export */}
          <div style={{ marginTop: 18 }}>
            <button
              className='w-full text-white font-bold cursor-pointer'
              style={{
                padding: '11px 0',
                background: '#1f8e4e',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
              }}
            >
              ⬇ Export breakdown as Excel
            </button>
            <p
              className='font-semibold text-[#75757b] text-center'
              style={{ margin: '8px 0 0', fontSize: 12, lineHeight: 1.3 }}
            >
              Two sheets: every log entry with date & time · summary by reason
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
