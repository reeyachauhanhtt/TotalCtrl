import { useState, useEffect, useRef } from 'react';

const OPTIONS = [
  { id: 'all', label: 'Show all (Transferred in and Transferred out)' },
  { id: 'in', label: 'Transferred in' },
  { id: 'out', label: 'Transferred out' },
];

export default function ShowAllDropdown({ value, onChange, isOpen, onToggle }) {
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

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

  const selected = OPTIONS.find((o) => o.id === value) ?? OPTIONS[0];

  const filtered = OPTIONS.filter((o) =>
    o.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className='relative' style={{ width: 400 }} ref={wrapperRef}>
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
        {/* <div
          className='flex items-center flex-1 overflow-hidden relative'
          style={{
            padding: '0px 12px',
            fontSize: 14,
            fontWeight: 400,
            lineHeight: '20px',
          }}
        >
          {!isOpen && (
            <span
              className='absolute'
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
              {selected.label}
            </span>
          )}
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOpen) onToggle();
            }}
            className='bg-transparent outline-none'
            style={{
              boxSizing: 'content-box',
              width: isOpen ? '100%' : 2,
              border: 0,
              fontSize: 'inherit',
              opacity: 1,
              padding: 0,
              color: '#333',
            }}
            readOnly={!isOpen}
          />
        </div> */}

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
              {selected.label}
            </span>
          )}
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Menu */}
      {isOpen && (
        <div
          className='absolute z-10 bg-white'
          style={{
            top: '100%',
            marginTop: 8,
            marginBottom: 8,
            width: '100%',
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
            {filtered.map((opt) => {
              const isSelected = opt.id === selected.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.id);
                    onToggle();
                  }}
                  style={{
                    backgroundColor: isSelected
                      ? 'rgb(234,247,238)'
                      : 'transparent',
                    padding: '8px 24px',
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
                    {opt.label}
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
            })}
          </div>
        </div>
      )}
    </div>
  );
}
