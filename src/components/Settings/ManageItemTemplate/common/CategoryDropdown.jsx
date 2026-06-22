import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProductGroups } from '../../../../services/manageItemTemplateService';

export default function CategoryDropdown({ selected, onSelect, error }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['productGroups'],
    queryFn: fetchProductGroups,
    staleTime: Infinity,
  });

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
          {selected?.name || 'Select category...'}
        </span>
        <img
          src='/icons/chevron-down-small.svg'
          alt=''
          className='w-6 h-6 shrink-0'
        />
      </div>

      {open && (
        <ul className='absolute z-50 mt-2 w-full rounded border border-[#d7d7db] bg-white py-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.12)] max-h-[215px] overflow-y-auto list-none m-0 p-0'>
          {categories.map((c) => (
            <li
              key={c.id}
              onClick={() => {
                onSelect(c);
                setOpen(false);
              }}
              className={`flex items-center justify-between px-5 py-2 text-[14px] leading-5 text-[#19191c] cursor-pointer hover:bg-[#f1f1f5] ${
                selected?.id === c.id ? 'bg-[#eaf7ee]' : ''
              }`}
            >
              <span>{c.name}</span>
              {selected?.id === c.id && (
                <img src='/icons/check-small.svg' alt='' className='w-6 h-6' />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
