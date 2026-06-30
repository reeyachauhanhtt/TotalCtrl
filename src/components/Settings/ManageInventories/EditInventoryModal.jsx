import { useState } from 'react';
import { FiX } from 'react-icons/fi';

import WhiteButton from '../../Common/WhiteButton';
import GreenButton from '../../Common/GreenButton';
import FormInput from '../../Common/FormInput';

export default function EditInventoryModal({ open, onClose, inventory }) {
  const [inventoryName, setInventoryName] = useState(inventory?.name ?? '');

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-auto'>
      <div className='w-[616px] bg-white rounded shadow-[0_4px_4px_rgba(0,0,0,0.12)]'>
        {/* Header */}
        <div className='flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-transparent rounded-t'>
          <h2 className='text-[18px] leading-6 font-semibold text-[#333]'>
            Edit inventory info
          </h2>
          <button onClick={onClose} className='cursor-pointer'>
            <FiX size={20} className='text-gray-600' />
          </button>
        </div>

        {/* Body */}
        <div className='h-[352px] px-12 pt-9 pb-6 text-[#737373] text-base leading-6'>
          <div className='w-[400px]'>
            <label className='block mb-1 text-[11px] leading-4 font-semibold tracking-[0.08em] uppercase text-[#6b6b6f]'>
              Inventory name
            </label>
            <FormInput
              value={inventoryName}
              onChange={(e) => setInventoryName(e.target.value)}
              className='w-full'
            />
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between px-8 py-[10px] border-t border-gray-200'>
          <WhiteButton
            onClick={onClose}
            className='px-3 py-1.5 hover:border-gray-900 hover:text-gray-900'
          >
            Cancel
          </WhiteButton>

          <GreenButton
            disabled={!inventoryName.trim()}
            className='h-[38px] px-3 py-1.5'
          >
            Save
          </GreenButton>
        </div>
      </div>
    </div>
  );
}
