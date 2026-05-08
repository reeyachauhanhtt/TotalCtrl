import { useState, useEffect, useRef } from 'react';

export default function SupplierSearchDropdown({
  suppliers = [],
  selectedSupplier,
  onSelect,
  className = '',
  supplierError = false,
  borderError = false,
  onBlur,
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const wrapperRef = useRef(null);

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.toLowerCase());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // reset search when closed
  useEffect(() => {
    if (!open && !selectedSupplier) setSearchTerm('');
  }, [open]);

  // outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setSearchTerm('');
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const filteredSuppliers = suppliers.filter((s) =>
    (s.Name || s.ShortCode)?.toLowerCase().includes(debouncedSearch),
  );

  return (
    <div className={`relative w-60 ${className}`} ref={wrapperRef}>
      {/* INPUT */}
      <div className='w-full relative'>
        <input
          value={
            searchTerm ||
            (selectedSupplier
              ? selectedSupplier.Name || selectedSupplier.ShortCode
              : '')
          }
          placeholder='Enter supplier name'
          onClick={() => setOpen(true)}
          onBlur={() => {
            if (selectedSupplier) {
              setSearchTerm(''); // clear searchTerm so value falls back to selectedSupplier.Name
            }

            if (!selectedSupplier) {
              onBlur?.();
            }
          }}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            setOpen(true);
            if (selectedSupplier) {
              onSelect(null);
            }
          }}
          className={`w-full px-4 py-3 text-[14px] leading-6 text-[#19191c] outline-none rounded border ${
            supplierError || borderError
              ? 'bg-[#fff7f7] border-[#fc5c63] shadow-[0_0_0_1px_#fc5c63]'
              : 'border-[#d7d8e0] focus:border-green-600 focus:ring-1 focus:ring-green-600'
          }`}
        />

        {supplierError && (
          <p className='text-[#d93a3f] text-[14px] leading-5 font-semibold pt-2'>
            This field is required
          </p>
        )}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className='absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-115 overflow-y-auto opacity-90'>
          {filteredSuppliers.length === 0 ? (
            <div className='px-4 py-3 text-sm text-gray-400'>
              No suppliers found
            </div>
          ) : (
            filteredSuppliers.map((s) => {
              const isSelected = selectedSupplier?.Id === s.Id;
              return (
                <div
                  key={s.Id}
                  onClick={() => {
                    onSelect(s);
                    setSearchTerm(s.Name || s.ShortCode); //  IMPORTANT
                    setOpen(true);
                  }}
                  className={`px-4 py-3 text-[13px] leading-5 cursor-pointer flex justify-between items-center hover:bg-gray-200 ${
                    isSelected ? 'bg-gray-200' : ''
                  }`}
                >
                  <span className='text-gray-700'>{s.Name || s.ShortCode}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
