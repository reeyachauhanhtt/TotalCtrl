export default function Checkbox({
  checked,
  onChange,
  disabled = false,
  size = 20,
  className = '',
}) {
  const inner =
    size === 20
      ? { left: '7px', top: '4px', width: '4px', height: '8px' }
      : { left: '9px', top: '5px', width: '5px', height: '10px' };

  return (
    <label
      className={`relative block select-none ${disabled ? 'cursor-default' : 'cursor-pointer'} ${className}`}
      style={{ paddingLeft: `${size}px`, marginBottom: 0 }}
    >
      <input
        type='checkbox'
        checked={checked}
        onChange={disabled ? undefined : onChange}
        disabled={disabled}
        className='absolute opacity-0 cursor-pointer h-0 w-0'
      />
      <span
        className='absolute top-0 left-0'
        style={{
          width: size,
          height: size,
          borderRadius: '4px',
          border: `1px solid ${disabled ? '#e5e7eb' : checked ? '#23a956' : '#d7d7db'}`,
          backgroundColor: disabled ? '#f3f4f6' : checked ? '#23a956' : '#fff',
          display: 'block',
        }}
      >
        {checked && !disabled && (
          <span
            className='absolute border-white'
            style={{
              left: inner.left,
              top: inner.top,
              width: inner.width,
              height: inner.height,
              border: 'solid white',
              borderWidth: '0 2px 2px 0',
              transform: 'rotate(45deg)',
              display: 'block',
            }}
          />
        )}
      </span>
    </label>
  );
}
