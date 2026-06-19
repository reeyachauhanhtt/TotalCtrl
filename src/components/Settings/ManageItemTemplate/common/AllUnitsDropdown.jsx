import { useState, useEffect, useRef } from 'react';

export default function AllUnitDropdown({
  options = [],
  selected,
  onSelect,
  placeholder = 'Select unit...',
  error,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className='relative w-full'>
      <div
        onClick={() => setOpen((p) => !p)}
        className={`flex h-12 w-full cursor-pointer items-center justify-between rounded border bg-white px-4 text-sm ${
          error
            ? 'border-[#fc5c63] shadow-[0_0_0_1px_#fc5c63] bg-[#fff7f7]'
            : 'border-[#d7d8e0]'
        }`}
      >
        <span className={selected ? 'text-[#19191c]' : 'text-[#6b6b6f]'}>
          {selected?.label || selected?.name || placeholder}
        </span>
        <img
          src='/icons/chevron-down-small.svg'
          alt=''
          className='w-6 h-6 shrink-0'
        />
      </div>

      {open && (
        <ul className='absolute z-50 mt-2 w-full rounded border border-[#d7d7db] bg-white py-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.12)] max-h-[215px] overflow-y-auto list-none m-0 p-0'>
          {options.length === 0 ? (
            <li className='px-5 py-2 text-[14px] text-[#6b6b6f]'>
              No units found
            </li>
          ) : (
            options.map((u) => {
              const isSelected =
                selected?.id === u.id && selected?.role === u.role;
              return (
                <li
                  key={u.id}
                  onClick={() => {
                    onSelect(u);
                    setOpen(false);
                  }}
                  className={`flex items-center justify-between px-5 py-2 text-[14px] leading-5 text-[#19191c] cursor-pointer hover:bg-[#f1f1f5] ${isSelected ? 'bg-[#eaf7ee]' : ''}`}
                >
                  <span>{u.label || u.name}</span>
                  {isSelected && (
                    <img
                      src='/icons/check-small.svg'
                      alt=''
                      className='w-6 h-6'
                    />
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
