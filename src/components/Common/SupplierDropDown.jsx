import { useState, useRef, useEffect } from 'react';

export default function SupplierDropdown({
  suppliers = [],
  selectedSupplier,
  setSelectedSupplier,
  className = '',
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

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`relative w-60 ${className}`}>
      <button
        onClick={() => setOpen((p) => !p)}
        className='flex items-center justify-between w-full h-10 px-4 text-sm text-gray-900 border border-gray-300 rounded-sm hover:border-gray-400'
      >
        <span className='truncate'>
          {selectedSupplier?.Name || 'All Suppliers'}
        </span>

        <img
          src='/icons/chevron-down-small.svg'
          width={26}
          height={26}
          alt=''
        />
      </button>

      {open && (
        <div className='absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-md z-50 max-h-55 overflow-y-auto'>
          {/* ALL SUPPLIERS */}
          <div
            onClick={() => {
              setSelectedSupplier(null);
              setOpen(false);
            }}
            className={`px-4 py-3 text-[13px] leading-5 cursor-pointer flex justify-between items-center hover:bg-gray-100 ${
              !selectedSupplier ? 'bg-emerald-50' : ''
            }`}
          >
            All Suppliers
            {!selectedSupplier && (
              <img src='/icons/check-small.svg' width={26} height={26} alt='' />
            )}
          </div>

          {/* SUPPLIERS LIST */}
          {suppliers.map((s) => (
            <div
              key={s.Id}
              onClick={() => {
                setSelectedSupplier(s);
                setOpen(false);
              }}
              className={`px-4 py-3 text-[13px] leading-5 cursor-pointer flex justify-between items-center hover:bg-gray-100 ${
                selectedSupplier?.Id === s.Id ? 'bg-emerald-50' : ''
              }`}
            >
              {s.Name || s.ShortCode}
              {selectedSupplier?.Id === s.Id && (
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
