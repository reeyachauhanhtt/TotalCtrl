import { useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function TransferInventoryDropdown({
  label,
  value,
  placeholder = 'Select Inventory',
  inventories = [],
  isOpen,
  setOpen,
  onSelect,
  excludeId, // for "To" dropdown
}) {
  const ref = useRef(null);

  // outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredList = excludeId
    ? inventories.filter((inv) => inv.id !== excludeId)
    : inventories;

  return (
    <div className='mb-6'>
      <label className='text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block'>
        {label}
      </label>

      <div className='relative' ref={ref}>
        {/* BUTTON */}
        <button
          onClick={() => setOpen(!isOpen)}
          className='flex items-center justify-between w-80 h-10 px-3 border border-gray-300 rounded text-sm text-gray-700 cursor-pointer'
        >
          <span>{value?.name || placeholder}</span>
          <FiChevronDown size={14} className='text-gray-400' />
        </button>

        {/* DROPDOWN */}
        {isOpen && (
          <div className='absolute top-full mt-2 w-80 h-60 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-56 overflow-y-auto py-1'>
            {filteredList.map((inv) => {
              const isSelected = inv.id === value?.id;

              return (
                <div
                  key={inv.id}
                  onClick={() => {
                    onSelect(inv);
                    setOpen(false);
                  }}
                  className={`flex items-center mt-1 justify-between px-4 py-2.5 text-sm transition-colors ${
                    isSelected
                      ? 'bg-emerald-50 text-gray-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{inv.name}</span>

                  {isSelected && (
                    <svg
                      className='w-4 h-4 text-emerald-500 shrink-0'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2.5'
                    >
                      <path d='M5 13l4 4L19 7' />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
