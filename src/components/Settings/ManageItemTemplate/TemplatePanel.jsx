import { useState } from 'react';

import WhiteButton from '../../Common/WhiteButton';
import GreenButton from '../../Common/GreenButton';
import UploadOrderModal from '../../Common/UploadOrderModal';
import AddItemTemplateModal from './AddItemTemplate';

export default function TemplatePanel({
  onUploadExcel,
  onUploadOrder,
  onItemAdded,
}) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  return (
    <>
      <div className='w-[95%] mx-auto mt-10 mb-10 flex justify-between items-start'>
        <div className='flex items-start'>
          <span className='mr-4 text-[32px] font-semibold leading-10 tracking-[-0.01em] text-[#19191c]'>
            Manage Item Templates
          </span>

          <label className='mt-2.5 inline-block whitespace-nowrap rounded bg-[#ffe3e5] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#a71a23]'>
            Duplicate Templates Found (44)
          </label>
        </div>

        <div className='flex items-center gap-4'>
          <WhiteButton
            onClick={onUploadExcel}
            className='flex items-center gap-3'
          >
            <img src='/icons/uploadgrey.svg' alt='' className='h-4 w-4' />
            Upload an excel
          </WhiteButton>

          <WhiteButton
            onClick={() => setShowUploadModal(true)}
            className='flex items-center gap-3'
          >
            <img src='/icons/uploadgrey.svg' alt='' className='h-4 w-4' />
            Upload an order
          </WhiteButton>

          <GreenButton onClick={() => setShowAddItemModal(true)}>
            <img src='/icons/plus_icon.png' alt='' className='h-4 w-4' />
            Add item template
          </GreenButton>
        </div>

        {showUploadModal && (
          <UploadOrderModal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
          />
        )}
      </div>

      {showAddItemModal && (
        <AddItemTemplateModal
          isOpen={showAddItemModal}
          onClose={() => setShowAddItemModal(false)}
          onSuccess={(itemName) => {
            setShowAddItemModal(false);
            onItemAdded?.(itemName);
          }}
        />
      )}
    </>
  );
}
