import GreenButton from '../../Common/GreenButton';

export default function ManageInventoriesHeader({ onAddClick }) {
  return (
    <div
      className='w-[95%] mx-auto flex items-center justify-between'
      style={{ margin: '25px auto' }}
    >
      <div>
        <h2 className='text-[32px] font-semibold leading-10 tracking-[-0.01em] text-[#19191c] m-0'>
          Manage Inventories
        </h2>
      </div>
      <div>
        <GreenButton className='py-2.5' onClick={onAddClick}>
          <img src='/icons/plus_icon.png' alt='' className='w-4 h-4' />
          <span>Add new inventory</span>
        </GreenButton>
      </div>
    </div>
  );
}
