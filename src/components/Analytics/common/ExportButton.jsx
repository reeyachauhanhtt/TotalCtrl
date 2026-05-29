export default function ExportButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className='h-9 px-5 bg-white text-[14px] font-semibold text-[#19191c] cursor-pointer rounded-sm'
      style={{ border: '1px solid #d7d8e0' }}
    >
      Export Data
    </button>
  );
}
