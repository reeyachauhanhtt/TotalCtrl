import { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function SearchInput({
  value,
  onChange,
  onDebouncedChange,
  debounceMs = 300,
  placeholder = 'Search...',
  className = '',
}) {
  const [focused, setFocused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!onDebouncedChange) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onDebouncedChange(value);
    }, debounceMs);
    return () => clearTimeout(timerRef.current);
  }, [value]);

  return (
    <div
      className={`flex items-center bg-white rounded px-3 gap-2 transition-all ${
        focused ? 'border-2 border-[#23a956]' : 'border border-[#d7d8e0]'
      } ${className}`}
    >
      <FiSearch className='text-gray-950 shrink-0' size={16} />
      <input
        type='text'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className='w-full py-2 text-sm text-[#333] outline-none bg-transparent'
      />
    </div>
  );
}
