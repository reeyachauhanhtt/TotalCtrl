import { useState, useEffect } from 'react';
import GreenButton from '../../Common/GreenButton';
import SearchInput from '../../Common/SearchInput';

export default function ManageRolesHeader({ onAddClick, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div
      className='w-[95%] mx-auto flex items-center justify-between'
      style={{ margin: '25px auto' }}
    >
      <div>
        <h2 className='text-[32px] font-semibold leading-10 tracking-[-0.01em] text-[#19191c] m-0'>
          Manage Roles
        </h2>
      </div>
      <div className='flex! align-center'>
        <SearchInput
          className='w-100 mr-6 mx-2'
          placeholder='Search roles...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onDebouncedChange={onSearch}
        />

        <GreenButton className='py-2.5' onClick={onAddClick}>
          <img src='/icons/plus_icon.png' alt='' className='w-4 h-4' />
          <span>Add new role</span>
        </GreenButton>
      </div>
    </div>
  );
}
