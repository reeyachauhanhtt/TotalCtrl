import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FiX } from 'react-icons/fi';

import WhiteButton from '../../Common/WhiteButton';
import GreenButton from '../../Common/GreenButton';
import Input from '../../Common/Input';
import { createInventory } from '../../../services/manageInventoriesService';
import { showSuccessToast } from '../../../utils/showToast';
import { MANAGE_INVENTORIES_MODAL_TITLES } from '../../../constants/titles';

export default function AddNewInventory({ open, onClose }) {
  const [inventoryName, setInventoryName] = useState('');
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  if (!open) return null;

  const handleSave = async () => {
    try {
      setSaving(true);
      await createInventory(inventoryName.trim());

      showSuccessToast('Inventory added successfully');
      setInventoryName('');
      onClose();
      queryClient.invalidateQueries({ queryKey: ['inventories-with-access'] });
    } catch (error) {
      console.error('Failed creating inventory', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-auto'>
      <div className='w-[616px] bg-white rounded shadow-[0_4px_4px_rgba(0,0,0,0.12)]'>
        <div className='flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-transparent rounded-t'>
          <h2 className='text-[18px] leading-6 font-semibold text-[#333]'>
            {MANAGE_INVENTORIES_MODAL_TITLES.ADD_NEW_INVENTORY}
          </h2>
          <button onClick={onClose} className='cursor-pointer'>
            <FiX size={20} className='text-gray-600' />
          </button>
        </div>

        <div className='h-[352px] px-12 pt-9 pb-6 text-[#737373] text-base leading-6'>
          <div className='w-[400px]'>
            <label className='block mb-1 text-[11px] leading-4 font-semibold tracking-[0.08em] uppercase text-[#6b6b6f]'>
              Inventory name
            </label>
            <Input
              value={inventoryName}
              onChange={(e) => setInventoryName(e.target.value)}
              className='w-full'
            />
          </div>
        </div>

        <div className='flex items-center justify-between px-8 py-[10px] border-t border-gray-200'>
          <WhiteButton
            onClick={onClose}
            className='px-3 py-1.5 hover:border-gray-900 hover:text-gray-900'
          >
            Cancel
          </WhiteButton>

          <GreenButton
            disabled={!inventoryName.trim() || saving}
            onClick={handleSave}
            className='h-[38px] px-3 py-1.5'
          >
            Save
          </GreenButton>
        </div>
      </div>
    </div>
  );
}
