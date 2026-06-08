import { formatPrice } from '../../../utils/format';
import ProgressBar from '../../Analytics/common/ProgressBar';

export default function TotalValueOfWastedFood({ totalValue, percent }) {
  //   const progressPercent = Math.min(percent ?? 0, 100);
  //   const dashArray = `${progressPercent}, 100`;

  return (
    <div style={{ width: '50%', marginTop: 16 }}>
      <span
        className='block w-full font-semibold text-[#19191c]'
        style={{
          margin: '24px 0',
          fontSize: 18,
          lineHeight: '24px',
          letterSpacing: '-0.01em',
        }}
      >
        Total value of wasted food
      </span>

      <h2
        className='w-full font-semibold text-[#19191c]'
        style={{
          fontSize: 64,
          lineHeight: '64px',
          letterSpacing: '-0.01em',
          marginBottom: 0,
        }}
      >
        {formatPrice(totalValue ?? 0)}
      </h2>

      <div style={{ margin: '24px 0' }}>
        <ProgressBar value={percent} />
      </div>

      <span
        className='text-[#19191c]'
        style={{ fontWeight: 400, fontSize: 14 }}
      >
        = {percent?.toFixed(2) ?? '0.00'}% of all checked-out food
      </span>
    </div>
  );
}
