export default function ExportButton({ onClick, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className='h-9 px-5 bg-white text-[14px] font-semibold text-[#19191c] rounded-sm'
      style={{
        border: '1px solid #d7d8e0',
        opacity: disabled ? 0.3 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      Export Data
    </button>
  );
}
