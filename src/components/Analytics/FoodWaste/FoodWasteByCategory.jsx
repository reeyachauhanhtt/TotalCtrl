import { formatPrice } from '../../../utils/format';
import ProgressBar from '../common/ProgressBar';

export default function FoodWasteByCategory({ categories }) {
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
        {(categories ?? []).map((cat, i) => (
          <div key={i} style={{ width: '85%', marginTop: 24 }}>
            <div className='flex justify-between'>
              <span
                className='flex items-center text-[#19191c]'
                style={{ fontWeight: 400, fontSize: 14, lineHeight: '20px' }}
              >
                {cat.name} ({cat.percent?.toFixed(2)}%)
              </span>
              <span
                className='text-[#19191c]'
                style={{ fontWeight: 400, fontSize: 14, lineHeight: '20px' }}
              >
                {formatPrice(cat.value)}
              </span>
            </div>
            <div style={{ marginTop: 6 }}>
              <ProgressBar value={cat.percent ?? 0} fullWidth />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
