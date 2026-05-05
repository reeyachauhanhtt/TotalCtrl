import { FiX } from 'react-icons/fi';

export default function ConfirmModal({
  open,
  onClose,
  title,
  description,
  confirmLabel = 'Yes, Cancel',
  cancelLabel = 'No, Continue',
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='bg-white rounded-lg shadow-[0_4px_4px_rgba(0,0,0,0.12)] w-170 h-109.75 flex flex-col'>
        {/* Header */}
        <div className='bg-white rounded-t-lg flex items-center justify-between px-7.25 py-6 pl-12'>
          <h2 className='text-[18px] font-bold text-[#333] leading-6 w-[95%] mr-7.25'></h2>
          <span onClick={onClose} className='cursor-pointer float-right'>
            <FiX size={20} strokeWidth={2.5} className='text-gray-700' />
          </span>
        </div>

        {/* Body */}
        <div className='flex-1 text-center px-30 pb-16 pt-0 text-[16px] leading-6 text-[#737373]'>
          <h2 className='text-[24px] font-semibold text-[#333] leading-8 mb-6'>
            {title}
          </h2>

          {description && (
            <p className='text-[16px] text-[#737373] leading-6'>
              {description}
            </p>
          )}

          {/* Buttons */}
          <div className='mt-0'>
            <div className='inline-grid pl-8.75 text-center'>
              <button
                onClick={onConfirm}
                className='w-60.5 h-10 bg-[#e1464d] text-white text-[14px] font-semibold rounded-sm mt-15 tracking-[0.04em] cursor-pointer border-none capitalize'
              >
                {confirmLabel}
              </button>

              <button
                onClick={onClose}
                className='w-60.5 h-10 bg-white text-[#595959] text-[14px] font-semibold rounded-sm mt-5 tracking-[0.04em] cursor-pointer border border-[#666] capitalize hover:bg-[#333] hover:text-white transition'
              >
                {cancelLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
