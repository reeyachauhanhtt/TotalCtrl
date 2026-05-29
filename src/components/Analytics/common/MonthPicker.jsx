import { useState, useRef, useEffect } from 'react';
import { DateRangePicker, createStaticRanges } from 'react-date-range';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  subWeeks,
  subMonths,
  subYears,
} from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const staticRanges = createStaticRanges([
  {
    label: 'Today',
    range: () => ({
      startDate: startOfDay(new Date()),
      endDate: endOfDay(new Date()),
    }),
  },
  {
    label: 'Yesterday',
    range: () => ({
      startDate: startOfDay(subDays(new Date(), 1)),
      endDate: endOfDay(subDays(new Date(), 1)),
    }),
  },
  {
    label: 'This Week',
    range: () => ({
      startDate: startOfWeek(new Date()),
      endDate: endOfWeek(new Date()),
    }),
  },
  {
    label: 'Last Week',
    range: () => ({
      startDate: startOfWeek(subWeeks(new Date(), 1)),
      endDate: endOfWeek(subWeeks(new Date(), 1)),
    }),
  },
  {
    label: 'This Month',
    range: () => ({
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
    }),
  },
  {
    label: 'Last Month',
    range: () => ({
      startDate: startOfMonth(subMonths(new Date(), 1)),
      endDate: endOfMonth(subMonths(new Date(), 1)),
    }),
  },
  {
    label: 'This Year',
    range: () => ({
      startDate: startOfYear(new Date()),
      endDate: endOfYear(new Date()),
    }),
  },
  {
    label: 'Last Year',
    range: () => ({
      startDate: startOfYear(subYears(new Date(), 1)),
      endDate: endOfYear(subYears(new Date(), 1)),
    }),
  },
]);

export default function MonthPicker({ onApply }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('This Month');
  const [range, setRange] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: 'selection',
    },
  ]);
  const [pendingRange, setPendingRange] = useState(range);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleOpen() {
    setPendingRange(range);
    setOpen(true);
  }

  function handleCancel() {
    setPendingRange(range);
    setOpen(false);
  }

  function handleApply() {
    setRange(pendingRange);
    // find matching static range label
    const matched = staticRanges.find((r) => {
      const { startDate, endDate } = r.range();
      return (
        startDate.toDateString() === pendingRange[0].startDate.toDateString() &&
        endDate.toDateString() === pendingRange[0].endDate.toDateString()
      );
    });
    setLabel(matched ? matched.label : 'Custom');
    onApply?.(pendingRange[0]);
    setOpen(false);
  }

  return (
    <div className='relative' ref={containerRef}>
      {/* Trigger */}
      <button
        onClick={handleOpen}
        className='flex items-center justify-between h-9 text-[14px] text-[#19191c] font-normal cursor-pointer rounded-sm px-3 bg-white'
        style={{ border: '1px solid #d7d8e0', width: 200 }}
      >
        <span>{label}</span>
        <svg width='10' height='6' viewBox='0 0 10 6' fill='none'>
          <path
            d='M1 1L5 5L9 1'
            stroke='#19191c'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>

      {/* Calendar Panel */}
      {open && (
        <div
          className='absolute right-0 z-50 rounded-lg overflow-hidden'
          style={{
            border: '1px solid #e7e7ec',
            boxShadow:
              '0 2px 4px rgba(51,51,82,.08), 0 2px 6px rgba(51,51,82,.08)',
            top: 'calc(100% + 4px)',
          }}
        >
          <DateRangePicker
            ranges={pendingRange}
            onChange={(item) => setPendingRange([item.selection])}
            staticRanges={staticRanges}
            inputRanges={[]}
            months={2}
            direction='horizontal'
            rangeColors={['#abdfbb']}
            showMonthAndYearPickers={false}
          />

          {/* Bottom bar */}
          <div
            className='flex items-center justify-end bg-white px-4'
            style={{
              height: 50,
              borderTop: '1px solid #e6e6ed',
            }}
          >
            <button
              onClick={handleCancel}
              className='h-9 w-16.5 flex items-center justify-center text-[14px] font-semibold text-[#6b6b6f] rounded-sm mr-3 cursor-pointer bg-white'
              style={{ border: '1px solid #d7d7db' }}
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className='h-9 w-16.5 flex items-center justify-center text-[14px] font-semibold text-white rounded-sm cursor-pointer'
              style={{ backgroundColor: '#23a956' }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
