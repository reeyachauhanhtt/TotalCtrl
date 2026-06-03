export default function GreenButton({
  children,
  className = '',
  disabled = false,
  disabledCursor = 'not-allowed',
  ...props
}) {
  return (
    <div
      style={{
        cursor: disabled ? disabledCursor : 'pointer',
        display: 'inline-flex',
      }}
    >
      <button
        disabled={disabled}
        style={{ pointerEvents: disabled ? 'none' : 'auto' }}
        className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 text-sm rounded-md font-bold transition disabled:opacity-60 ${className}`}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
