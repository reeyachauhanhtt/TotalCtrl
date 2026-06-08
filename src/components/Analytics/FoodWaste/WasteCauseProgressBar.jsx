const CAUSE_COLORS = {
  expiration: '#66C888',
  bad_quality: '#6053D2',
  damaged: '#FFE24D',
  other_reason: '#939397',
};

export default function WasteCauseProgressBar({ cause, percent }) {
  const color = CAUSE_COLORS[cause] ?? '#D9D9D9';
  const dashArray = `${percent ?? 0}, 100`;

  return (
    <svg
      viewBox='0 0 100 1'
      preserveAspectRatio='none'
      style={{ width: '100%', overflow: 'hidden' }}
    >
      <path
        d='M 0.5,0.5 L 99.5,0.5'
        strokeLinecap='round'
        stroke='#D9D9D9'
        strokeWidth='1'
        fillOpacity='0'
      />
      <path
        d='M 0.5,0.5 L 99.5,0.5'
        strokeLinecap='round'
        stroke={color}
        strokeWidth='1'
        fillOpacity='0'
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: '0px',
          transition:
            'stroke-dashoffset 0.3s, stroke-dasharray 0.3s, stroke 0.3s linear, 0.06s',
        }}
      />
    </svg>
  );
}
