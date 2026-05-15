import { useState, useRef, useEffect } from 'react';

export default function StockDropdown({
  stockFilter,
  setStockFilter,
  options = [],
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === stockFilter)?.label || 'All items';

  return (
    <div ref={wrapperRef} className='relative w-60'>
      {/* BUTTON */}
      <button
        onClick={() => setOpen((p) => !p)}
        className='flex items-center justify-between w-full h-10 px-4 text-[13px] text-gray-900 border border-gray-300 rounded-sm hover:border-gray-400'
      >
        <span className='truncate'>{selectedLabel}</span>

        <img
          src='/icons/chevron-down-small.svg'
          width={26}
          height={26}
          alt=''
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className='absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md z-50 max-h-55 overflow-y-auto'>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                setStockFilter(option.value);
                setOpen(false);
              }}
              className={`px-4 py-2 text-sm cursor-pointer flex justify-between items-center hover:bg-gray-100 ${
                stockFilter === option.value ? 'bg-emerald-50' : ''
              }`}
            >
              {option.label}
              {stockFilter === option.value && (
                <img
                  src='/icons/check-small.svg'
                  width={26}
                  height={26}
                  alt=''
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
