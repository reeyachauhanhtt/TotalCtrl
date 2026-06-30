import { useState, useRef } from 'react';

import WhiteButton from '../../Common/WhiteButton';
import GreenButton from '../../Common/GreenButton';
import StatusBadge from '../../Common/StatusBadge';
import UploadOrderModal from '../../Common/UploadOrderModal';
import UploadAnExcelModal from './UploadAnExcelModal';
import AddItemTemplateModal from './AddItemTemplate';
import { showSuccessToast } from '../../../utils/showToast';

export default function TemplatePanel({ onItemAdded, duplicateCount }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);

  return (
    <>
      <div className='w-[95%] mx-auto mt-10 mb-10 flex justify-between items-start'>
        <div className='flex items-start'>
          <span className='mr-4 text-[32px] font-semibold leading-10 tracking-[-0.01em] text-[#19191c]'>
            Manage Item Templates
          </span>

          <StatusBadge
            variant='duplicate'
            label={`Duplicate Templates Found (${duplicateCount})`}
            className='mt-2.5'
          />
        </div>

        <div className='flex items-center gap-4'>
          <WhiteButton
            onClick={() => setShowExcelModal(true)}
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

        {showExcelModal && (
          <UploadAnExcelModal
            isOpen={showExcelModal}
            onClose={() => setShowExcelModal(false)}
            onSuccess={() => {
              setShowExcelModal(false);
              showSuccessToast('Products added successfully');
            }}
          />
        )}

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
