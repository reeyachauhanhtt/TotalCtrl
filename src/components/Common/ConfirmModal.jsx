import { FiX } from 'react-icons/fi';
import WhiteButton from './WhiteButton';

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
    <div className='fixed inset-0 z-60 flex items-center justify-center bg-black/20'>
      <div className='bg-white rounded-lg shadow-xl px-10 py-10 w-150 h-100 flex flex-col items-center text-center relative'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-900 font-bold cursor-pointer'
        >
          <FiX size={20} strokeWidth={2.5} />
        </button>

        <h3 className='text-[20px] font-bold text-gray-900 mt-5 mb-3'>
          {title}
        </h3>

        {description && (
          <p className='text-sm text-gray-500 mt-3 mb-15 leading-relaxed'>
            {description}
          </p>
        )}

        <button
          onClick={onConfirm}
          className='w-2/5 bg-red-500 text-white text-xs font-semibold py-2.5 rounded-md mb-4 transition cursor-pointer'
        >
          {confirmLabel}
        </button>

        <WhiteButton
          onClick={onClose}
          className='w-2/5 hover:bg-gray-900 hover:text-white hover:border-gray-900 text-xs font-semibold  transition'
        >
          {cancelLabel}
        </WhiteButton>
      </div>
    </div>
  );
}
