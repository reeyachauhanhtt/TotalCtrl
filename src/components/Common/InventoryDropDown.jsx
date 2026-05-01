import { useState, useEffect, useRef } from 'react';

export default function InventoryDropdown({
  inventories = [],
  selectedInventory,
  onSelect,
  error,
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
    if (!open) setSearchTerm('');
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

  const filteredInventories = inventories.filter((inv) =>
    inv.name?.toLowerCase().includes(debouncedSearch),
  );

  function InventoryItem({ inv }) {
    const isSelected = selectedInventory?.id === inv.id;

    return (
      <div
        onClick={() => {
          onSelect(inv);
          setOpen(false);
          setSearchTerm('');
        }}
        className={`px-8 py-4 text-sm cursor-pointer flex justify-between items-center hover:bg-gray-50 ${
          isSelected ? 'bg-emerald-50' : ''
        }`}
      >
        <span className='text-gray-700'>{inv.name}</span>
        {isSelected && (
          <img src='/icons/check-small.svg' width={26} height={26} alt='' />
        )}
      </div>
    );
  }

  return (
    <div className='relative' ref={wrapperRef}>
      {/* INPUT + DROPDOWN */}
      <div
        className={`flex items-center gap-2 rounded-sm w-80 h-10 px-3 py-1.5 text-xs text-gray-700 transition ${
          open
            ? 'border-2 border-emerald-600'
            : 'border border-gray-300 hover:border-gray-500'
        }`}
        onClick={() => setOpen(true)}
      >
        <input
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setOpen(true);
          }}
          placeholder={selectedInventory?.name || 'Select inventory'}
          className='flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-600'
        />

        <img
          src='/icons/chevron-down-small.svg'
          width={26}
          height={26}
          alt=''
          className={`transition ${open ? 'opacity-100' : 'opacity-50'}`}
        />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className='absolute top-full mt-2 w-80 h-75 mr-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-100 overflow-y-auto'>
          {error ? (
            <div className='px-8 py-10 text-sm text-red-500'>
              Failed to load inventories
            </div>
          ) : filteredInventories.length === 0 ? (
            <div className='px-8 py-10 text-sm text-gray-400'>
              No inventories found
            </div>
          ) : (
            <>
              {/* EDIT SECTION */}
              {filteredInventories.filter(
                (inv) =>
                  inv.permission?.toLowerCase() === 'editor' ||
                  inv.permission?.toLowerCase() === 'owner',
              ).length > 0 && (
                <>
                  <div className='px-8 py-10 pt-6 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider'>
                    You can edit
                    <div className='px-8 border-t border-gray-100 my-1' />
                  </div>

                  {filteredInventories
                    .filter(
                      (inv) =>
                        inv.permission?.toLowerCase() === 'editor' ||
                        inv.permission?.toLowerCase() === 'owner',
                    )
                    .map((inv) => (
                      <InventoryItem key={inv.id} inv={inv} />
                    ))}
                </>
              )}

              {/* VIEW SECTION */}
              {filteredInventories.filter(
                (inv) =>
                  inv.permission?.toLowerCase() !== 'editor' &&
                  inv.permission?.toLowerCase() !== 'owner',
              ).length > 0 && (
                <>
                  <div className='px-8 py-10 pt-6 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider'>
                    You can view
                    <div className='px-8 border-t border-gray-100 my-1' />
                  </div>

                  {filteredInventories
                    .filter(
                      (inv) =>
                        inv.permission?.toLowerCase() !== 'editor' &&
                        inv.permission?.toLowerCase() !== 'owner',
                    )
                    .map((inv) => (
                      <InventoryItem key={inv.id} inv={inv} />
                    ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
