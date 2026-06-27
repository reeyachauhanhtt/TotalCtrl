import { useState } from 'react';

export default function FormInput({
  value,
  onChange,
  type = 'text',
  placeholder = '',
  suffix,
  error = false,
  errorMessage,
  disabled = false,
  className = '',
  autoFocus = false,
  onBlur,
  inputClassName = '',
}) {
  const [focused, setFocused] = useState(false);

  const wrapperClass = (() => {
    if (disabled) return 'border-[#D7D8E0] bg-[#f1f1f5]';
    if (focused) return 'border-2 border-[#23a956]';
    if (error)
      return 'border-[#fc5c63] shadow-[0_0_0_1px_#fc5c63] bg-[#fff7f7]';
    return 'border-[#D7D8E0]';
  })();

  return (
    <div className={className}>
      <div
        className={`flex h-12 w-full items-center rounded border px-4 gap-1 ${wrapperClass}`}
      >
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          className={`min-w-0 shrink w-full text-[14px] text-[#333] outline-none bg-transparent disabled:cursor-not-allowed ${
            type === 'number'
              ? '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              : ''
          } ${inputClassName}`}
        />
        {suffix && value && (
          <span className='shrink-0 text-[14px] text-[#19191c] whitespace-nowrap'>
            {suffix}
          </span>
        )}
      </div>
      {error && errorMessage && (
        <p className='mt-1 text-[13px] text-[#d93a3f]'>{errorMessage}</p>
      )}
    </div>
  );
}
