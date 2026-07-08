import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import FormInput from '../../Common/Input';

export default function RoleSelect({
  options,
  value,
  onChange,
  placeholder = 'Select User Role...',
  menuWidth = 274,
  variant = 'detailed',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const updatePosition = () => {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuStyle({
        position: 'fixed',
        bottom: window.innerHeight - rect.top + 8,
        right: window.innerWidth - rect.right,
        width: menuWidth,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, menuWidth]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        triggerRef.current?.contains(e.target) ||
        menuRef.current?.contains(e.target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={triggerRef} className='relative text-[16px]'>
      <FormInput
        readOnly
        value={value?.label ?? ''}
        placeholder={placeholder}
        onChange={() => {}}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        onBlur={() => setIsOpen(false)}
        inputClassName='pr-6 capitalize'
        disabled={disabled}
      />
      <svg
        className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-150 ${
          disabled
            ? 'text-[#d7d8e0]'
            : isOpen
              ? 'text-[#333]'
              : 'text-[#d7d8e0]'
        }`}
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
      >
        <path
          d='M5 7.5l5 5 5-5'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>

      {isOpen &&
        menuStyle &&
        createPortal(
          <div
            ref={menuRef}
            onMouseDown={(e) => e.preventDefault()}
            style={menuStyle}
            className='z-[9999] max-h-[310px] overflow-y-auto rounded border border-[#d7d8e0] bg-white shadow-md'
          >
            {options.map((option) => {
              const isSelected = value?.value === option.value;

              if (variant === 'compact') {
                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={`cursor-pointer px-4 py-2.5 text-sm text-[#333] ${
                      isSelected ? 'bg-[#e5ede7]' : 'hover:bg-[#f5f5f7]'
                    }`}
                  >
                    {option.label}
                  </div>
                );
              }

              return (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`cursor-pointer px-4 py-3 text-[14px] ${
                    isSelected ? 'bg-[#e5ede7]' : 'hover:bg-[#f5f5f7]'
                  }`}
                >
                  <div className='m-2.5'>
                    <div className='flex items-start justify-between gap-2'>
                      <span className='font-semibold capitalize text-[#333]'>
                        {option.label}
                      </span>
                      {isSelected && (
                        <svg
                          className='mt-0.5 shrink-0'
                          width='16'
                          height='16'
                          viewBox='0 0 16 16'
                          fill='none'
                        >
                          <path
                            d='M13.5 4L6 11.5L2.5 8'
                            stroke='#2f7a4d'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      )}
                    </div>
                    {option.description && (
                      <p className='mt-1 text-xs leading-4 text-[#6b6b6f]'>
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
