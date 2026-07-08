import { FiX } from 'react-icons/fi';

export default function Modal({
  open,
  onClose,
  title,
  description,
  actionText,
  actionType,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-[99999] flex items-center justify-center bg-black/40'>
      <div className='w-[680px] rounded-[4px] bg-white shadow-[0_4px_4px_rgba(0,0,0,0.12)]'>
        {/* Header */}
        <div className='flex justify-end px-[29px] pt-[24px]'>
          <button
            onClick={onClose}
            className='cursor-pointer text-[24px] text-[#333]'
          >
            <FiX />
          </button>
        </div>

        {/* Body */}
        <div className='px-[48px] pb-[64px] text-center'>
          <h2 className='mx-auto mb-[24px] w-[400px] text-[24px] font-semibold leading-[32px] text-[#333]'>
            {title}
          </h2>

          <p className='text-[16px] leading-[24px] text-[#737373]'>
            {description}
          </p>

          {/* Buttons */}
          <div className=' mt-[68px] flex justify-center gap-[24px]'>
            <button
              onClick={onClose}
              className=' h-[40px] w-[242px] rounded-[4px] border border-[#666] bg-white text-[14px] font-semibold text-[#595959] hover:bg-[#333] hover:text-white'
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className={`h-[40px] w-[242px] rounded-[4px] text-[14px] font-semibold text-white ${actionType === 'activate' ? 'bg-[#23a956]' : 'bg-[#e1464d]'} `}
            >
              {actionText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
