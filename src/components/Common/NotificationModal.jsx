import React, { useEffect, useRef } from 'react';
import bellImg from '../../assets/empty-notification-state.png';
const NotificationModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-1000'>
      {/* Backdrop (NO blur) */}
      <div className='absolute inset-0 bg-black/0'></div>

      {/* Modal */}
      <div
        ref={modalRef}
        className='absolute mt-2.5 right-6 top-16 w-135 h-200 bg-white rounded-lg shadow-xl border border-gray-200'
      >
        {/* Header */}
        <div className='flex items-center justify-between px-5 py-6 border-b border-gray-200'>
          <h2 className='text-[16px] font-semibold text-gray-800'>
            Notifications
          </h2>
          <button className='text-[12px] text-green-600 font-medium opacity-50'>
            Mark all as read
          </button>
        </div>

        {/* Content */}
        <div className='flex flex-col items-center justify-center text-center px-15 py-50 min-h-70'>
          <img src={bellImg} alt='bell' className='w-38 h-28 mb-5 ' />

          <h3 className='text-[22px] font-semibold text-gray-800 mb-5'>
            Nothing to inform you yet
          </h3>

          <p className='text-[15px] text-gray-400 leading-normal max-w-65'>
            When there's important update about the items in your inventory,
            like advising you to use a specific product before getting damaged,
            it will appear over here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
