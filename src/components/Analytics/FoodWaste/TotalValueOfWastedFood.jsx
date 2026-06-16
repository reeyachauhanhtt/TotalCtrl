import { formatPrice } from '../../../utils/format';
import ProgressBar from '../../Analytics/common/ProgressBar';
import { SkeletonBar } from '../../Common/Skeleton';

export default function TotalValueOfWastedFood({
  totalValue,
  percent,
  isLoading = false,
}) {
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

      {isLoading ? (
        <>
          <SkeletonBar
            style={{
              height: 56,
              width: 320,
              borderRadius: 12,
              marginBottom: 14,
            }}
          />
          <SkeletonBar
            style={{
              height: 12,
              width: 400,
              borderRadius: 20,
              marginBottom: 14,
            }}
          />
          <SkeletonBar style={{ height: 20, width: 180, borderRadius: 20 }} />
        </>
      ) : (
        <>
          <h2
            className='w-full font-semibold text-[#19191c]'
            style={{
              fontSize: 64,
              lineHeight: '64px',
              letterSpacing: '-0.01em',
              marginBottom: 0,
            }}
          >
            {totalValue ? formatPrice(totalValue) : '0 kr'}
          </h2>
          <div style={{ margin: '24px 0' }}>
            <ProgressBar value={percent} />
          </div>
          <span
            className='text-[#19191c]'
            style={{ fontWeight: 400, fontSize: 14 }}
          >
            = {percent ? percent.toFixed(2) : '0'}% of all checked-out food
          </span>
        </>
      )}
    </div>
  );
}
