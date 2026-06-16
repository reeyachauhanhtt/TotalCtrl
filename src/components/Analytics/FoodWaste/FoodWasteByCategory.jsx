import { formatPrice } from '../../../utils/format';
import ProgressBar from '../common/ProgressBar';
import { SkeletonBar } from '../../Common/Skeleton';

export default function FoodWasteByCategory({ categories, isLoading = false }) {
  return (
    <div style={{ width: '50%' }}>
      <span
        className='block w-full font-semibold text-[#19191c]'
        style={{
          margin: '24px 0',
          fontSize: 18,
          lineHeight: '24px',
          letterSpacing: '-0.01em',
        }}
      >
        Food waste by category
      </span>

      <div>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ width: '85%', marginTop: 10 }}>
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
                    height: 12,
                    width: '100%',
                    borderRadius: 20,
                    marginTop: 10,
                  }}
                />
              </div>
            ))
          : (categories ?? []).map((cat, i) => (
              <div key={i} style={{ width: '85%', marginTop: 24 }}>
                <div className='flex justify-between'>
                  <span
                    className='flex items-center text-[#19191c]'
                    style={{
                      fontWeight: 400,
                      fontSize: 14,
                      lineHeight: '20px',
                    }}
                  >
                    {cat.name} ({cat.percent?.toFixed(2)}%)
                  </span>
                  <span
                    className='text-[#19191c]'
                    style={{
                      fontWeight: 400,
                      fontSize: 14,
                      lineHeight: '20px',
                    }}
                  >
                    {formatPrice(cat.value)}
                  </span>
                </div>
                <div style={{ marginTop: 15 }}>
                  <ProgressBar value={cat.percent ?? 0} fullWidth />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
