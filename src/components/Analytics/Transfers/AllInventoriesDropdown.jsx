import { useState, useEffect, useRef } from 'react';

export default function AllInventoriesDropdown({
  inventories = [],
  value,
  onChange,
  isOpen,
  onToggle,
}) {
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

  // reset search on close
  useEffect(() => {
    if (!isOpen) setSearchTerm('');
  }, [isOpen]);

  // outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        if (isOpen) onToggle();
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  const ALL_OPTION = { id: null, name: 'All inventories from/to' };
  const selected = value
    ? (inventories.find((i) => i.id === value) ?? ALL_OPTION)
    : ALL_OPTION;

  const filtered = [ALL_OPTION, ...inventories].filter((inv) =>
    inv.name.toLowerCase().includes(debouncedSearch),
  );

  return (
    <div className='relative' style={{ width: 320 }} ref={wrapperRef}>
      {/* Control */}
      <div
        onClick={onToggle}
        className='flex items-center justify-between h-10 bg-white cursor-default'
        style={{
          borderRadius: 4,
          border: isOpen ? '1px solid #23a956' : '1px solid #cccccc',
          boxShadow: isOpen ? '#23a956 0px 0px 0px 1px' : 'none',
          transition: '100ms',
          marginRight: 24,
        }}
      >
        {/* Left: selected value + hidden input */}
        <div
          className='flex items-center flex-1 overflow-hidden relative'
          style={{
            padding: '0px 12px',
            fontSize: 14,
            fontWeight: 400,
            lineHeight: '20px',
          }}
        >
          {/* placeholder label — hidden while typing */}
          {!searchTerm && (
            <span
              className='absolute pointer-events-none'
              style={{
                color: '#333',
                maxWidth: 'calc(100% - 8px)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              {selected.name}
            </span>
          )}
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!isOpen) onToggle();
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOpen) onToggle();
            }}
            className='bg-transparent outline-none w-full'
            style={{
              border: 0,
              fontSize: 'inherit',
              opacity: 1,
              padding: 0,
              color: '#333',
              minWidth: 2,
            }}
          />
        </div>

        {/* Chevron */}
        <div
          className='flex items-center self-stretch'
          style={{ flexShrink: 0 }}
        >
          <div style={{ color: '#666', display: 'flex', padding: 8 }}>
            <img
              src='/icons/chevron-down-small.svg'
              width={28}
              height={28}
              alt=''
              className={`transition ${isOpen ? 'opacity-100' : 'opacity-50'}`}
            />
          </div>
        </div>
      </div>

      {/* Menu — opens upward per dev CSS (bottom: 100%) */}
      {isOpen && (
        <div
          className='absolute z-10 bg-white'
          style={{
            top: '100%',
            marginTop: 8,
            marginBottom: 8,
            width: 300,
            borderRadius: 4,
            boxShadow:
              'rgba(0,0,0,0.1) 0px 0px 0px 1px, rgba(0,0,0,0.1) 0px 4px 11px',
          }}
        >
          <div
            style={{
              maxHeight: 320,
              overflowY: 'auto',
              paddingTop: 4,
              paddingBottom: 4,
            }}
          >
            {filtered.length === 0 ? (
              <div style={{ padding: '8px 24px', fontSize: 14, color: '#999' }}>
                No inventories found
              </div>
            ) : (
              filtered.map((inv, i) => {
                const isSelected = inv.id === selected.id;
                return (
                  <div
                    key={inv.id ?? 'all'}
                    onClick={() => {
                      onChange(inv.id);
                      onToggle();
                    }}
                    style={{
                      backgroundColor: isSelected
                        ? 'rgb(234,247,238)'
                        : 'transparent',
                      padding: '15px 30px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'default',
                      userSelect: 'none',
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <p
                      style={{
                        color: '#19191c',
                        fontWeight: 400,
                        lineHeight: '20px',
                        fontSize: 14,
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      {inv.name}
                    </p>
                    {isSelected && (
                      <img
                        src='/icons/check-small.svg'
                        width={26}
                        height={26}
                        alt=''
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
