import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSubcategories } from '../../../../services/manageItemTemplateService';

export default function SubcategoryDropdown({
  selected,
  onSelect,
  categoryId,
  error,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const { data: subcategories = [], isLoading } = useQuery({
    queryKey: ['subcategories', categoryId],
    queryFn: () => fetchSubcategories(categoryId),
    enabled: !!categoryId,
  });

  const disabled = !categoryId || isLoading;
  const noSubcategories =
    !!categoryId && !isLoading && subcategories.length === 0;

  let placeholder = 'Select subcategory...';
  if (!categoryId) placeholder = 'Select subcategory...';
  if (isLoading) placeholder = 'Loading subcategories...';

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
        onClick={() => !disabled && setOpen((p) => !p)}
        className={`flex h-12 w-full items-center justify-between rounded border bg-white px-4 text-sm ${
          disabled || noSubcategories
            ? 'cursor-default text-[#b7b7b7]'
            : 'cursor-pointer'
        } ${
          error
            ? 'border-[#fc5c63] shadow-[0_0_0_1px_#fc5c63] bg-[#fff7f7]'
            : 'border-[#d7d8e0]'
        }`}
      >
        {/* <span className={selected ? 'text-[#19191c]' : 'text-[#6b6b6f]'}>
          {selected?.name || placeholder}
        </span> */}
        <span
          className={
            selected
              ? 'text-[#19191c]'
              : disabled || noSubcategories
                ? 'text-[#6b6b6f] opacity-50'
                : 'text-[#6b6b6f]'
          }
        >
          {selected?.name || placeholder}
        </span>
        <img
          src='/icons/chevron-down-small.svg'
          alt=''
          className='w-6 h-6 shrink-0'
        />
      </div>

      {open && !disabled && (
        <ul className='absolute z-50 mt-2 w-full rounded border border-[#d7d7db] bg-white py-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.12)] max-h-[215px] overflow-y-auto list-none m-0 p-0'>
          {subcategories.map((s) => (
            <li
              key={s.id}
              onClick={() => {
                onSelect(s);
                setOpen(false);
              }}
              className={`flex items-center justify-between px-5 py-2 text-[14px] leading-5 text-[#19191c] cursor-pointer hover:bg-[#f1f1f5] ${
                selected?.id === s.id ? 'bg-[#eaf7ee]' : ''
              }`}
            >
              <span>{s.name}</span>
              {selected?.id === s.id && (
                <img
                  src='/icons/check-small.svg'
                  alt=''
                  className='w-6 h-6  '
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {noSubcategories && (
        <div
          className='mt-[10px] w-full rounded px-4 py-3 mb-5 inline-flex font-semibold text-[14px] leading-[18px]'
          style={{ background: '#f2f1ff', color: '#362a96' }}
        >
          No subcategories available for selected category.
        </div>
      )}
    </div>
  );
}
