<<<<<<< HEAD
import WhiteButton from "../../Common/WhiteButton";
import GreenButton from "../../Common/GreenButton";

export default function TemplatePanel() {
  return (
    <div className="w-[95%] mx-auto mt-10 mb-10 flex justify-between items-start">
      {/* Left */}
      <div className="flex items-start">
        <span className="text-[32px] font-semibold leading-10 tracking-[-0.01em] text-[#19191c] mr-4">
          Manage Item Templates
        </span>
        <label className="inline-block rounded text-[11px] font-bold leading-4 tracking-[0.08em] uppercase bg-[#ffe3e5] text-[#a71a23] px-2 py-1 mt-2.5">
=======
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
>>>>>>> df9b3eeb39159afec13a62d8c39c51552ca9cc58
          Duplicate Templates Found (44)
        </label>
      </div>

      {/* Right */}
<<<<<<< HEAD
      <div className="flex items-center gap-4">
        <WhiteButton className="flex items-center gap-3">
          <img src="/icons/uploadgrey.svg" alt="" className="w-4 h-4" />
          Upload an excel
        </WhiteButton>
        <WhiteButton className="flex items-center gap-3">
          <img src="/icons/uploadgrey.svg" alt="" className="w-4 h-4" />
          Upload an order
        </WhiteButton>
        <GreenButton>
          <img src="/icons/plus_icon.png" alt="" className="w-4 h-4" />
=======
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
>>>>>>> df9b3eeb39159afec13a62d8c39c51552ca9cc58
          Add item template
        </GreenButton>
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

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
>>>>>>> df9b3eeb39159afec13a62d8c39c51552ca9cc58
