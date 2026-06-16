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
          Duplicate Templates Found (44)
        </label>
      </div>

      {/* Right */}
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
          Add item template
        </GreenButton>
      </div>
    </div>
  );
}
