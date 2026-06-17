<<<<<<< HEAD
import { useState, useRef, useEffect } from "react";

const ISSUE_OPTIONS = [
  "All item templates",
  "Duplicate item templates",
  "Item templates without SKU",
];

const CATEGORY_OPTIONS = [
  { label: "No category", isHeader: true },
  "Alcoholic Beverages",
  "Cleaning Products",
  "Dry Goods",
  "Frozen Goods",
  "Fruits & Vegetables",
  "In-House Production",
  "Non-alcoholic Beverages",
  "Non-foods",
  "Other",
  "Refrigerated Goods",
];

const SUBCATEGORY_MAP = {
  "Alcoholic Beverages": ["Beer", "Wine", "Spirits", "Armagnac"],
  "Dry Goods": ["Bread", "Pasta", "Rice"],
  "Fruits & Vegetables": ["Roots", "Leafy Greens", "Citrus"],
  "Refrigerated Goods": ["Butter and margarine", "Dairy", "Meat"],
  "Frozen Goods": ["Frozen Meat", "Frozen Vegetables"],
  "Non-foods": ["Cleaning", "Packaging"],
};

const INVENTORY_OPTIONS = [
  { label: "No inventory", isHeader: true },
  "Main Inventory",
  "Walk-in fridge I RFID",
  "Dry Storage I RFID",
  "Empty inventory",
  "Tanvi Inventory",
  "Pinkesh Inventory",
];

const SUPPLIER_OPTIONS = [
  "No supplier",
  "Asko Engros",
  "Bama Gruppen",
  "Coop",
  "Findus Norge",
  "GF Solutions",
  "Nortura",
  "Prior Norge",
  "Røst Seafood",
];

function FilterDropdown({
  label,
  options = [],
  disabled = false,
  width = 200,
  selected,
  onSelect,
}) {
  const [open, setOpen] = useState(false);
=======
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
>>>>>>> df9b3eeb39159afec13a62d8c39c51552ca9cc58
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
<<<<<<< HEAD
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative" style={{ width: `${width}px` }}>
      <div
        onClick={() => !disabled && setOpen((p) => !p)}
        className={`flex items-center justify-between bg-white h-9 rounded px-4 pr-2 transition-all ${
          disabled ? "cursor-default" : "cursor-pointer"
        } ${open ? "border border-[#23a956]" : "border border-[#d7d7db]"}`}
      >
        <span
          className={`text-sm font-normal truncate mr-5 ${disabled ? "text-[#b7b7b7]" : "text-[#19191c]"}`}
=======
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
>>>>>>> df9b3eeb39159afec13a62d8c39c51552ca9cc58
        >
          {selected || label}
        </span>
        <img
<<<<<<< HEAD
          src="/icons/chevron-down-small.svg"
          alt=""
          className="w-6 h-6 shrink-0"
=======
          src='/icons/chevron-down-small.svg'
          alt=''
          className='ml-2 w-4 h-4 shrink-0'
>>>>>>> df9b3eeb39159afec13a62d8c39c51552ca9cc58
        />
      </div>

      {open && options.length > 0 && (
<<<<<<< HEAD
        <ul className="absolute bg-white z-50 mt-2 py-[15px] list-none m-0 p-0 min-w-[250px] max-h-[480px] overflow-y-auto border border-[#d7d7db] rounded shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          {options.map((opt, i) => {
            const isHeader = typeof opt === "object" && opt.isHeader;
            const label = isHeader ? opt.label : opt;
            return (
              <li
                key={i}
                onClick={() => {
                  onSelect(label);
                  setOpen(false);
                }}
                className={`w-full text-sm font-semibold leading-5 cursor-pointer inline-block text-[#19191c] hover:bg-[#f1f1f5] px-4 py-2 ${
                  isHeader ? "border-b border-[#dee2e6] mb-2 pb-2.5" : ""
                }`}
                style={{ whiteSpace: "break-spaces" }}
              >
                {label}
              </li>
            );
          })}
=======
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
>>>>>>> df9b3eeb39159afec13a62d8c39c51552ca9cc58
        </ul>
      )}
    </div>
  );
}

export default function TemplateMainSection() {
<<<<<<< HEAD
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [filters, setFilters] = useState({
    issue: null,
    category: null,
    subcategory: null,
    inventory: null,
    supplier: null,
  });

  const hasActiveFilter = Object.values(filters).some(Boolean);

  function clearFilters() {
    setFilters({
      issue: null,
      category: null,
      subcategory: null,
      inventory: null,
      supplier: null,
    });
  }

  const subcategoryOptions =
    filters.category && SUBCATEGORY_MAP[filters.category]
      ? [
          { label: "No subcategory", isHeader: true },
          ...SUBCATEGORY_MAP[filters.category],
        ]
      : [];

  const subcategoryDisabled =
    !filters.category || subcategoryOptions.length === 0;

  return (
    <div className="w-full px-8">
      {/* Search */}
      <div className="relative w-full">
        <img
          src="/icons/search.svg"
          alt=""
          className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none brightness-0"
        />
        <input
          type="text"
          placeholder="Enter item name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full text-sm text-[#333] outline-none bg-white rounded py-2 pl-9 pr-4 leading-6 transition-all ${
            focused ? "border-2 border-[#23a956]" : "border border-[#d7d8e0]"
          }`}
=======
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
>>>>>>> df9b3eeb39159afec13a62d8c39c51552ca9cc58
        />
      </div>

      {/* Filters */}
<<<<<<< HEAD
      <div className="flex gap-6 w-full py-[18px] items-center">
        <FilterDropdown
          label="Issue"
          options={ISSUE_OPTIONS}
          width={150}
          selected={filters.issue}
          onSelect={(v) => setFilters((p) => ({ ...p, issue: v }))}
        />
        <FilterDropdown
          label="Category"
          options={CATEGORY_OPTIONS}
          width={200}
          selected={filters.category}
          onSelect={(v) =>
            setFilters((p) => ({ ...p, category: v, subcategory: null }))
          }
        />
        <FilterDropdown
          label="Subcategory"
          options={subcategoryOptions}
          disabled={subcategoryDisabled}
          width={200}
          selected={filters.subcategory}
          onSelect={(v) => setFilters((p) => ({ ...p, subcategory: v }))}
        />
        <FilterDropdown
          label="Inventory"
          options={INVENTORY_OPTIONS}
          width={200}
          selected={filters.inventory}
          onSelect={(v) => setFilters((p) => ({ ...p, inventory: v }))}
        />
        <FilterDropdown
          label="Supplier"
          options={SUPPLIER_OPTIONS}
          width={150}
          selected={filters.supplier}
          onSelect={(v) => setFilters((p) => ({ ...p, supplier: v }))}
        />

        {hasActiveFilter && (
          <span
            onClick={clearFilters}
            className="text-base font-semibold leading-4 cursor-pointer whitespace-nowrap"
            style={{ color: "#1f8e4e" }}
          >
            Clear filters
          </span>
        )}
=======
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
>>>>>>> df9b3eeb39159afec13a62d8c39c51552ca9cc58
      </div>
    </div>
  );
}
