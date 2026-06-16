import { useState, useRef, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';

const FILTER_OPTIONS = {
  issue: [
    'All item templates',
    'Duplicate item templates',
    'Item templates without SKU',
  ],
  category: [
    'Fruits & Vegetables',
    'Alcoholic Beverages',
    'Non-alcoholic Beverages',
    'Dry Goods',
  ],
  subcategory: [],
  inventory: ['Main Inventory', 'Walk-in fridge I RFID', 'Dry Storage I RFID'],
  supplier: ['Supplier A', 'Supplier B'],
};

function FilterDropdown({ label, options = [], disabled = false }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isPlaceholder = !selected;

  return (
    <div ref={ref} className='relative flex-1' style={{ minWidth: '150px' }}>
      <div
        onClick={() => !disabled && setOpen((p) => !p)}
        className={`flex items-center justify-between bg-white cursor-pointer h-9 rounded pl-5 pr-2 transition-[border] duration-100 ${
          open ? 'border border-[#23a956]' : 'border border-[#d7d7db]'
        }`}
      >
        <span
          className={`text-sm font-light whitespace-nowrap ${
            disabled ? 'text-[#b7b7b7]' : 'text-[#19191c]'
          }`}
        >
          {selected || label}
        </span>
        <img
          src='/icons/chevron-down-small.svg'
          alt=''
          className='ml-2 w-4 h-4 shrink-0'
        />
      </div>

      {open && options.length > 0 && (
        <ul className='absolute left-0 bg-white z-50 mt-2 border border-[#d7d7db] rounded shadow-lg py-3.75 list-none max-h-120 overflow-y-auto min-w-62.5'>
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                setSelected(opt);
                setOpen(false);
              }}
              className={`text-sm font-semibold leading-5 px-4 py-2 cursor-pointer hover:bg-[#f1f1f5] ${
                selected === opt ? 'text-[#23a956]' : 'text-[#19191c]'
              }`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TemplateMainSection() {
  const [search, setSearch] = useState('');

  return (
    <div className='w-full px-8'>
      {/* Search */}
      <div className='relative w-100'>
        <img
          src='/icons/search.svg'
          alt=''
          className='absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none brightness-0'
        />

        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Enter item name or SKU...'
          className='w-full pl-9 pr-3 py-2 border border-[#d7d8e0] rounded text-sm leading-6 text-[#333] outline-none focus:border-2 focus:border-[#23a956]'
        />
      </div>

      {/* Filters */}
      <div className='flex items-center gap-6 py-4.5'>
        <FilterDropdown label='Issue' options={FILTER_OPTIONS.issue} />
        <FilterDropdown label='Category' options={FILTER_OPTIONS.category} />
        <FilterDropdown
          label='Subcategory'
          options={FILTER_OPTIONS.subcategory}
          disabled
        />
        <FilterDropdown label='Inventory' options={FILTER_OPTIONS.inventory} />
        <FilterDropdown label='Supplier' options={FILTER_OPTIONS.supplier} />
      </div>
    </div>
  );
}
