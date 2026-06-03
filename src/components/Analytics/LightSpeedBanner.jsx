import GreenButton from '../Common/GreenButton';

export default function LightSpeedBanner() {
  return (
    <div
      className='w-full rounded mt-4 p-6'
      style={{ backgroundColor: 'rgb(242, 241, 255)' }}
    >
      <p
        className='text-[16px] font-semibold'
        style={{ color: 'rgb(54, 42, 150)' }}
      >
        Using Lightspeed POS to track your sales?{' '}
        <span className='underline cursor-pointer'>
          Connect it to TotalCtrl
        </span>{' '}
        to automatically calculate the food cost percentage for each day and
        compare its historic values to help you optimize your restaurant's
        performance.
      </p>

      <div className='mt-3'>
        <GreenButton>Connect Lightspeed to TotalCtrl</GreenButton>
      </div>
    </div>
  );
}
