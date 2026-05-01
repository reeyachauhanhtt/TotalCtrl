import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { FiX } from 'react-icons/fi';

import { fetchInventory } from '../../services/inventoryService';
import { setSelectedInventory } from '../../store/inventorySlice';

function DateFields({ label }) {
  return (
    <div>
      <label className='block font-semibold text-[18px] leading-6 tracking-[-0.01em] text-[#19191c] mb-3'>
        {label}
      </label>
      <div className='flex items-start gap-4'>
        <div className='mb-7'>
          <label className='block font-semibold text-[11px] leading-4 uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
            Day*
          </label>
          <input
            type='number'
            placeholder='dd'
            min={1}
            max={31}
            className='border border-[#d7d8e0] rounded px-4 py-3 text-[14px] leading-6 text-[#333] outline-none'
            style={{ width: '70px' }}
          />
        </div>
        <div className='mb-7'>
          <label className='block font-semibold text-[11px] leading-4 uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
            Month*
          </label>
          <input
            type='number'
            placeholder='mm'
            min={1}
            max={12}
            className='border border-[#d7d8e0] rounded px-4 py-3 text-[14px] leading-6 text-[#333] outline-none'
            style={{ width: '72px' }}
          />
        </div>
        <div className='mb-7'>
          <label className='block font-semibold text-[11px] leading-4 uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
            Year*
          </label>
          <input
            type='number'
            placeholder='yyyy'
            min={1}
            className='border border-[#d7d8e0] rounded px-4 py-3 text-[14px] leading-6 text-[#333] outline-none'
            style={{ width: '166px' }}
          />
        </div>
      </div>
    </div>
  );
}

export default function AddOrderManuallyModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [step, setStep] = useState(1);
  const dropdownRef = useRef(null);

  const { data } = useQuery({
    queryKey: ['inventories'],
    queryFn: fetchInventory,
  });

  const inventories = data?.Data || data?.data || [];

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    }
    if (openDropdown)
      document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  // Reset step on close
  function handleClose() {
    setStep(1);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className='flex items-center fixed z-1000 left-0 top-0 w-full h-full'
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className='flex flex-col bg-white rounded-lg shadow-md mx-auto'
        style={{ width: '75%', height: 'calc(100% - 48px)' }}
      >
        {/* Header */}
        <div className='shrink-0 flex items-center justify-between border-b border-[#e7e7ec] rounded-t px-7.25 pl-12 py-6'>
          <h2 className='text-[18px] leading-6 font-semibold text-[#19191c] mb-0 tracking-[-0.01em] flex items-center gap-4'>
            Add order manually
            <span className='text-[18px] leading-6 font-semibold text-[#19191c]'>
              Step {step}/3
            </span>
          </h2>
          <span className='cursor-pointer' onClick={handleClose}>
            <FiX size={22} color='#19191c' />
          </span>
        </div>

        {/* Body */}
        <div className='flex-1 text-[16px] leading-6 text-[#737373] pt-12 pb-6 overflow-y-auto'>
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className='ml-12'>
                <h2 className='text-[24px] leading-8 font-semibold tracking-[-0.01em] text-[#19191c] text-left mb-3'>
                  Select Inventory
                </h2>
                <p className='text-[#6b6b6f] text-[15px] font-normal leading-6 mb-0'>
                  Which inventory should we update when this order is delivered?
                </p>
              </div>

              <div className='mt-9 mb-5 ml-12'>
                <div className='mb-7'>
                  <label className='block font-semibold text-[11px] leading-4 uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
                    Inventory
                  </label>
                  <div ref={dropdownRef} className='relative w-[320px]'>
                    <div
                      onClick={() => setOpenDropdown((p) => !p)}
                      className='h-10 w-[320px] rounded-[3px] border border-[#d7d7db] bg-white flex items-center justify-between px-3 pl-5 cursor-pointer'
                    >
                      <span className='text-[14px] text-[#19191c]'>
                        {selectedInventory?.name || 'Select inventory'}
                      </span>
                      <img
                        src='/icons/chevron-down-small.svg'
                        width={24}
                        height={24}
                        alt=''
                      />
                    </div>

                    {openDropdown && (
                      <ul
                        className='absolute left-0 w-[320px] max-h-53.75 overflow-y-scroll bg-white border border-[#d7d7db] rounded shadow-[0_2px_8px_rgba(0,0,0,0.12)] py-3.75 z-100 m-0 list-none'
                        style={{ top: 'calc(100% + 8px)' }}
                      >
                        {inventories.map((inv) => {
                          const isSelected = selectedInventory?.id === inv.id;
                          return (
                            <li
                              key={inv.id}
                              onClick={() => {
                                dispatch(setSelectedInventory(inv));
                                setOpenDropdown(false);
                              }}
                              className='flex justify-between items-center font-normal text-[13px] leading-5 text-[#19191c] px-5 py-2 cursor-pointer'
                              style={{
                                backgroundColor: isSelected
                                  ? '#eaf7ee'
                                  : '#fff',
                                whiteSpace: 'break-spaces',
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected)
                                  e.currentTarget.style.backgroundColor =
                                    '#f9fafb';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  isSelected ? '#eaf7ee' : '#fff';
                              }}
                            >
                              <span>{inv.name}</span>
                              {isSelected && (
                                <img
                                  src='/icons/check-small.svg'
                                  width={22}
                                  height={22}
                                  alt=''
                                />
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className='mx-12'>
                <p className='text-[#6b6b6f] text-[15px] w-132.5 font-normal leading-6'>
                  When you import the order, it will also appear in the
                  TotalCtrl Inventory mobile app, so that you and your
                  colleagues can easily check off the ordered items on delivery.
                  The quantity of products you check off will be automatically
                  updated in the selected inventory.
                </p>
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className='ml-12'>
                <h2 className='text-[24px] leading-8 font-semibold tracking-[-0.01em] text-[#19191c] text-left mb-6'>
                  Order details
                </h2>
              </div>

              <div className='ml-12'>
                {/* Row 1 — Supplier + Order Number */}
                <div className='flex items-start'>
                  <div
                    className='mb-7'
                    style={{ width: '340px', marginRight: '64px' }}
                  >
                    <label className='block font-semibold text-[11px] leading-4 uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
                      Supplier name*
                    </label>
                    <input
                      type='text'
                      placeholder='Enter supplier name'
                      className='border border-[#d7d8e0] rounded px-4 py-3 w-full text-[14px] leading-6 text-[#333] outline-none'
                    />
                  </div>
                  <div className='mb-7' style={{ width: '340px' }}>
                    <label className='block font-semibold text-[11px] leading-4 uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
                      Order number
                    </label>
                    <input
                      type='text'
                      placeholder='Enter Order number'
                      className='border border-[#d7d8e0] rounded px-4 py-3 w-full text-[14px] leading-6 text-[#333] outline-none'
                    />
                  </div>
                </div>

                {/* Row 2 — Ordered on + Scheduled for */}
                <div className='flex items-start'>
                  <div style={{ marginRight: '64px' }}>
                    <DateFields label='Ordered on' />
                  </div>
                  <div>
                    <DateFields label='Scheduled for' />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className='shrink-0 border-t border-[#e7e7ec] px-12 py-3.5 flex justify-between items-center'>
          <button
            onClick={handleClose}
            className='border border-[#d7d7db] hover:border-[#19191c] hover:text-[#19191c] rounded bg-white font-semibold text-sm text-[#6b6b6f] px-3 py-1.5 cursor-pointer transition'
          >
            Cancel
          </button>

          <div className='flex items-center gap-3'>
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className='border border-[#d7d8e0] rounded bg-white font-semibold text-sm text-[#6b6b6f] px-3 py-1.5 cursor-pointer'
                style={{ marginRight: '24px' }}
              >
                Previous step
              </button>
            )}
            <button
              onClick={() => {
                if (step < 3) setStep((s) => s + 1);
              }}
              className='border-none rounded bg-[#23a956] hover:bg-[#0f6f36] font-semibold text-sm text-white px-3 leading-6 tracking-[0.04em] cursor-pointer h-9.5 transition'
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
