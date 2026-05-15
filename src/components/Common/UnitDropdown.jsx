import { useState, useRef, useEffect } from 'react';

export default function UnitDropdown({
  value,
  onChange,
  units,
  placeholder = 'Select unit',
  isError = false,
  isRedError = false,
  disabled = false,
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
      <div
        className={`flex items-center justify-between w-full h-8.25 px-2 rounded transition-colors ${
          disabled
            ? 'bg-[#f5f5f5] cursor-not-allowed'
            : isRedError
              ? 'bg-[#fff0f1]'
              : isError
                ? 'bg-[#f1f1f5]'
                : 'bg-transparent hover:bg-[#f1f1f5]'
        }`}
      >
        <input
          type='text'
          value={search}
          placeholder={value || placeholder}
          disabled={disabled}
          onFocus={() => {
            if (!disabled) setOpen(true);
          }}
          onClick={() => {
            if (!disabled) {
              setSearch('');
              setOpen(true);
            }
          }}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          className={`w-full bg-transparent outline-none text-[12px] ${
            disabled
              ? 'cursor-not-allowed text-[#666]'
              : isRedError
                ? 'text-[#a71a23]'
                : value
                  ? 'text-[#333333]'
                  : 'text-[#939397]'
          }`}
        />

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
      </div>

      {open && (
        <div className='absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-md z-50 max-h-75 overflow-y-auto'>
          {filteredUnits?.length > 0 ? (
            filteredUnits.map((unit) => (
              <div
                key={unit.id}
                onClick={() => {
                  onChange(unit.value, unit.id);
                  setSearch(unit.label);
                  setOpen(false);
                }}
                className={`px-3 py-1.5 text-[12px] hover:bg-gray-100 ${
                  value === unit.value
                    ? 'bg-green-50 text-[#333]'
                    : 'text-[#333]'
                }`}
              >
                {unit.label}
              </div>
            ))
          ) : (
            <div className='px-3 py-2 text-[12px] text-[#939397] text-center'>
              {units?.length ? 'No options' : 'Loading units…'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
