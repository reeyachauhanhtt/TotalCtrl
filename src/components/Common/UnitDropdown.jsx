import { useState, useRef, useEffect } from 'react';

export default function UnitDropdown({
  value,
  onChange,
  units,
  placeholder = 'Select unit',
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value || '');
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);

    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setSearch(value || '');
  }, [value]);

  const filteredUnits = units?.filter((unit) =>
    unit.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className='relative w-full' ref={ref}>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='flex items-center justify-between w-full h-8.25 px-2 text-[13px] bg-transparent outline-none cursor-default'
      >
        <span className={value ? 'text-[#333333]' : 'text-[#939397]'}>
          {value || placeholder}
        </span>

        <svg
          height='20'
          width='20'
          viewBox='0 0 20 20'
          aria-hidden='true'
          style={{
            color: open ? '#19191c' : 'rgb(215,216,224)',
            flexShrink: 0,
          }}
        >
          <path d='M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z' />
        </svg>
      </button>

      {open && (
        <div
          className='absolute left-0 w-full z-50 overflow-auto py-0.5'
          style={{
            top: 'calc(100% + 4px)',
            minWidth: '160px',
            maxHeight: '200px',
            borderRadius: '3px',
            border: '1px solid rgb(215,216,224)',
            boxShadow: 'rgba(0,0,0,0.1) 0px 2px 12px',
            background: 'rgba(255,255,255,0.9)',
            fontSize: '90%',
          }}
        >
          {units?.length > 0 ? (
            units.map((unit) => (
              <div
                key={unit.id}
                onClick={() => {
                  onChange(unit.value, unit.id);
                  setOpen(false);
                }}
                className={`px-3 py-1 text-[12px] cursor-pointer hover:bg-gray-100 ${
                  value === unit.value
                    ? 'bg-emerald-50 text-[#333]'
                    : 'text-[#333]'
                }`}
              >
                {unit.label}
              </div>
            ))
          ) : (
            <div className='px-3 py-2 text-[12px] text-[#939397]'>
              Loading units…
            </div>
          )}
        </div>
      )}
    </div>
  );
}
