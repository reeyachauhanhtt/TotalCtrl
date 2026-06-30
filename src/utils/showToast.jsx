import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';

export function showSuccessToast(message) {
  toast.custom(
    (t) => (
      <div
        className='flex items-center gap-3 bg-[#19191c] leading-6 px-6 py-4 rounded-lg'
        style={{ whiteSpace: 'nowrap' }}
      >
        <div className='w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center shrink-0'>
          <svg
            width='10'
            height='10'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#22c55e'
            strokeWidth='3'
          >
            <path d='M5 13l4 4L19 7' />
          </svg>
        </div>
        <span className='text-white text-[18px] font-light uppercase tracking-[0.08em]'>
          {message}
        </span>
        <button
          onClick={() => toast.dismiss(t.id)}
          className='text-white opacity-100 ml-2'
        >
          <FiX size={18} />
        </button>
      </div>
    ),
    { duration: 3500 },
  );
}

export function showErrorToast(message) {
  toast.custom(
    (t) => (
      <div
        className='flex items-center gap-3 bg-[#19191c] leading-6 px-6 py-4 rounded-lg'
        style={{ whiteSpace: 'nowrap' }}
      >
        <div className='w-5 h-5 rounded-full border-2 border-red-500 flex items-center justify-center shrink-0'>
          <svg
            width='10'
            height='10'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#ef4444'
            strokeWidth='3'
          >
            <path d='M6 6l12 12M6 18L18 6' />
          </svg>
        </div>
        <span className='text-white text-[18px] font-light uppercase tracking-[0.08em]'>
          {message}
        </span>
        <button
          onClick={() => toast.dismiss(t.id)}
          className='text-white opacity-100 ml-2'
        >
          <FiX size={18} />
        </button>
      </div>
    ),
    { duration: 3500 },
  );
}
