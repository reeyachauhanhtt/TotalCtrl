export default function TemplatePanel({
  onUploadExcel,
  onUploadOrder,
  onAddItem,
}) {
  return (
    <div
      style={{
        width: '95%',
        margin: '40px auto 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      {/* Left */}
      <div className='flex items-start'>
        <span
          style={{
            fontSize: '32px',
            lineHeight: '40px',
            fontWeight: '600',
            letterSpacing: '-0.01em',
            color: '#19191c',
            marginRight: '16px',
          }}
        >
          Manage Item Templates
        </span>
        <label
          style={{
            marginTop: '10px',
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: '600',
            fontSize: '11px',
            lineHeight: '16px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#a71a23',
            background: '#ffe3e5',
            whiteSpace: 'nowrap',
          }}
        >
          Duplicate Templates Found (44)
        </label>
      </div>

      {/* Right */}
      <div className='flex items-center gap-3'>
        <WhiteButton onClick={onUploadExcel}>
          <img src='/icons/upload-grey.svg' alt='' className='w-4 h-4' />
          Upload an excel
        </WhiteButton>
        <WhiteButton onClick={onUploadOrder}>
          <img src='/icons/upload-grey.svg' alt='' className='w-4 h-4' />
          Upload an order
        </WhiteButton>
        <GreenButton onClick={onAddItem}>
          <img src='/icons/plus-white.svg' alt='' className='w-4 h-4' />
          Add item template
        </GreenButton>
      </div>
    </div>
  );
}

function WhiteButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className='flex items-center gap-2 text-sm px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-semibold bg-white hover:border-gray-500 hover:text-gray-900 transition cursor-pointer'
    >
      {children}
    </button>
  );
}

function GreenButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className='flex items-center gap-2 bg-[#23a956] hover:bg-green-700 text-white px-5 py-2 text-sm rounded-md font-bold transition cursor-pointer'
    >
      {children}
    </button>
  );
}
