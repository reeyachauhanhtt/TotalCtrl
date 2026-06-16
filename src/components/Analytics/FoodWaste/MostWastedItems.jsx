import { formatPrice } from '../../../utils/format';
import { SkeletonBar } from '../../Common/Skeleton';

export default function MostWastedItems({ items, isLoading = false }) {
  const isEmpty = !items || items.length === 0;

  return (
    <div className='w-1/2' style={{ marginTop: 16 }}>
      <span
        className='block w-full font-semibold text-[#19191c]'
        style={{
          marginTop: 8,
          marginBottom: 24,
          fontSize: 18,
          lineHeight: '24px',
          letterSpacing: '-0.01em',
        }}
      >
        Top most wasted items
      </span>

      <div className='h-px bg-[#d7d7db]' style={{ width: '80%' }} />

      {isLoading ? (
        <table
          className='border-collapse'
          style={{ width: '80%', marginTop: 25 }}
        >
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                <td style={{ width: '60%', height: 43 }}>
                  <SkeletonBar
                    style={{ height: 20, width: 150, borderRadius: 20 }}
                  />
                </td>
                <td style={{ width: '20%', height: 43 }}>
                  <div className='flex justify-end'>
                    <SkeletonBar
                      style={{ height: 20, width: 80, borderRadius: 20 }}
                    />
                  </div>
                </td>
                <td style={{ width: '20%', height: 43 }}>
                  <div className='flex justify-end'>
                    <SkeletonBar
                      style={{ height: 20, width: 60, borderRadius: 20 }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : isEmpty ? (
        <div
          className='flex flex-col justify-center items-center'
          style={{ height: 237, width: '80%' }}
        >
          <img
            src='/img/lemon.png'
            alt='no data'
            className='object-contain'
            style={{ height: 80, width: 113 }}
          />
          <span
            className='font-semibold text-[#19191c] text-center'
            style={{
              fontSize: 18,
              lineHeight: '24px',
              letterSpacing: '-0.01em',
              marginTop: 24,
            }}
          >
            No Wasted Items
          </span>
          <p
            className='text-center text-[#939397] font-normal'
            style={{
              fontSize: 16,
              lineHeight: '24px',
              width: 348,
              marginTop: 1,
            }}
          >
            Remember to use the app to check out products every time you use
            something on the kitchen.
          </p>
        </div>
      ) : (
        <table
          className='border-collapse'
          style={{ width: '80%', marginTop: 25 }}
        >
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td
                  className='text-left '
                  style={{ width: '60%', height: 43, paddingLeft: 0 }}
                >
                  <span
                    className='text-[#19191c] text-sm'
                    style={{ lineHeight: '20px' }}
                  >
                    {item.name}
                  </span>
                </td>
                <td
                  className='text-right '
                  style={{ width: '20%', height: 43 }}
                >
                  <span
                    className='text-[#19191c] text-sm'
                    style={{ lineHeight: '20px' }}
                  >
                    {item.quantity} {item.unit}
                  </span>
                </td>
                <td
                  className='text-right'
                  style={{ width: '20%', height: 43, paddingRight: 0 }}
                >
                  <span
                    className='text-[#19191c] text-sm'
                    style={{ lineHeight: '20px' }}
                  >
                    {formatPrice(item.value)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div
        className='h-px bg-[#d7d7db]'
        style={{ width: '80%', marginTop: 15 }}
      />
    </div>
  );
}
