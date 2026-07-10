export default function ToggleSwitch({ checked, onChange, disabled = false }) {
  return (
    <label className='relative inline-block' style={{ width: 40, height: 22 }}>
      <input
        type='checkbox'
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className='opacity-0 w-0 h-0 peer'
      />
      <span
        className='absolute inset-0 rounded-full cursor-pointer transition-all duration-[400ms] bg-[#ccc] peer-checked:bg-[#4caf50]
          before:content-[""] before:absolute before:h-4 before:w-4 before:left-1 before:bottom-[3px]
          before:bg-white before:rounded-full before:transition-all before:duration-[400ms]
          peer-checked:before:translate-x-[18px]'
      />
    </label>
  );
}
