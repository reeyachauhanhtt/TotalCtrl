import ExportButton from '../common/ExportButton';
import MonthPicker from '../common/MonthPicker';

export default function SectionHeader({
  title,
  lastUpdated,
  showMonthPicker,
  onExport,
  onApplyDateRange,
}) {
  return (
    <div className='flex items-center justify-between w-full py-9.5'>
      <span className='text-[20px] font-semibold text-[#19191c] leading-7 tracking-[-0.01em]'>
        {title}
      </span>

      <div className='flex items-center gap-5'>
        {lastUpdated && (
          <span className='text-[14px] font-normal text-[#939397] leading-5'>
            {lastUpdated}
          </span>
        )}
        <ExportButton onClick={onExport} />
        {showMonthPicker && <MonthPicker onApply={onApplyDateRange} />}
      </div>
    </div>
  );
}
