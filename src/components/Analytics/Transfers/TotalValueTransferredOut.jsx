export default function TotalValueTransferredOut({
  totalValue,
  itemCount,
  inventoryCount,
}) {
  return (
    <div className='w-1/2 mt-4'>
      <span className='block w-full text-[18px] font-semibold tracking-[-0.01em] text-[#19191c] leading-6 my-6'>
        Total value transferred{' '}
        <img
          src='/icons/arrow-left-circle.svg'
          alt=''
          className='inline align-middle'
        />{' '}
        <span className='font-semibold text-[14px] leading-5 text-[#e2232e]'>
          OUT
        </span>
      </span>

      <h2 className='w-full text-[64px] font-semibold leading-16 tracking-[-0.01em] text-[#19191c]'>
        {totalValue ?? '0 kr'}
      </h2>

      <span className='block text-[14px] font-normal text-[#19191c] mt-6'>
        {itemCount ?? 0} item transferred from {inventoryCount ?? 0} inventory
      </span>
      <span className='block text-[14px] font-normal text-[#19191c]'></span>
    </div>
  );
}
