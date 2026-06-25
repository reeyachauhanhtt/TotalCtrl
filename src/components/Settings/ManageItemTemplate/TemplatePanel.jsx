import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

import WhiteButton from '../../Common/WhiteButton';
import GreenButton from '../../Common/GreenButton';
import UploadOrderModal from '../../Common/UploadOrderModal';
import UploadAnExcelModal from './UploadAnExcelModal';
import AddItemTemplateModal from './AddItemTemplate';

export default function TemplatePanel({
  onUploadExcel,
  onUploadOrder,
  onItemAdded,
}) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  // const [showSuccessToast, setShowSuccessToast] = useState(false);
  // const toastTimerRef = useRef(null);

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
              // onItemAdded?.('Products');
              toast.success('Products added successfully', {
                style: {
                  background: '#19191c',
                  color: '#fff',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontSize: '13px',
                },
                iconTheme: {
                  primary: '#23a956',
                  secondary: '#fff',
                },
                duration: 3500,
              });
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
      {/* 
      {showSuccessToast && (
        <div
          className='fixed bottom-0 z-50'
          style={{ left: '200px', right: '0' }}
        >
          <div className='mx-6 mb-4 bg-[#19191c] text-white text-[14px] leading-6 px-8 py-4 rounded-sm flex items-center gap-3'>
            <img src='/icons/right.svg' alt='' className='w-5 h-5' />
            <span>
              <strong>Products</strong> have been successfully added to your
              product database
            </span>
            <button
              onClick={() => setShowSuccessToast(false)}
              className='ml-auto text-white text-[18px] leading-none cursor-pointer bg-transparent border-none'
            >
              ✕
            </button>
          </div>
        </div>
      )} */}

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
