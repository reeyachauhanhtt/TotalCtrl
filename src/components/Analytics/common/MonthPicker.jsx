import { useState, useEffect } from 'react';
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
  format,
} from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './MonthPicker.css';

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

const STORAGE_KEY = 'analytics_date_range';

function loadPersistedRange() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const { startDate, endDate, label } = JSON.parse(saved);
    return {
      range: [
        {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          key: 'selection',
        },
      ],
      label,
    };
  } catch {
    return null;
  }
}

function saveRange(range, label) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      startDate: range[0].startDate,
      endDate: range[0].endDate,
      label,
    }),
  );
}

export default function MonthPicker({ onApply, singleMonth = false }) {
  const persisted = loadPersistedRange();

  const defaultRange = [
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: 'selection',
    },
  ];

  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState(persisted?.label ?? 'This Month');
  const [range, setRange] = useState(persisted?.range ?? defaultRange);
  const [pendingRange, setPendingRange] = useState(
    persisted?.range ?? defaultRange,
  );

  const SHOW_DATE_LABELS = ['This Year', 'Custom'];

  const displayLabel = SHOW_DATE_LABELS.includes(label)
    ? `${format(range[0].startDate, 'yyyy-MM-dd')} to ${format(range[0].endDate, 'yyyy-MM-dd')}`
    : label;

  const showClear = SHOW_DATE_LABELS.includes(label);

  function handleOpen() {
    setPendingRange(range);
    setOpen(true);
  }

  function handleCancel() {
    setPendingRange(range);
    setOpen(false);
  }

  function handleApply() {
    const matched = staticRanges.find((r) => {
      const { startDate, endDate } = r.range();
      return (
        startDate.toDateString() === pendingRange[0].startDate.toDateString() &&
        endDate.toDateString() === pendingRange[0].endDate.toDateString()
      );
    });
    const newLabel = matched ? matched.label : 'Custom';

    setRange(pendingRange);
    setLabel(newLabel);
    saveRange(pendingRange, newLabel); //  persist to localStorage
    onApply?.({
      startDate: pendingRange[0].startDate,
      endDate: pendingRange[0].endDate,
      label: newLabel,
    });
    setOpen(false);
  }

  return (
    <div className='relative'>
      <button
        onClick={open ? handleCancel : handleOpen}
        className='flex items-center justify-between h-9 text-[14px] text-[#19191c] font-normal cursor-pointer rounded-sm px-3 bg-white'
        style={{ border: '1px solid #d7d8e0', width: showClear ? 240 : 200 }}
      >
        <span>{displayLabel}</span>
        {showClear && !open ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              const defaultLabel = 'This Month';
              const defaultRange = [
                {
                  startDate: startOfMonth(new Date()),
                  endDate: endOfMonth(new Date()),
                  key: 'selection',
                },
              ];
              setRange(defaultRange);
              setPendingRange(defaultRange);
              setLabel(defaultLabel);
              saveRange(defaultRange, defaultLabel);
              onApply?.({
                startDate: defaultRange[0].startDate,
                endDate: defaultRange[0].endDate,
                label: defaultLabel,
              });
            }}
            className='ml-2 text-[#19191c] leading-none'
            style={{ fontSize: 16 }}
          >
            ×
          </span>
        ) : open ? (
          <img
            src='/icons/closepopup-icon.svg'
            alt='close'
            width={10}
            height={10}
          />
        ) : (
          <img
            src='/icons/select-box-down-icon.png'
            alt='open'
            width={10}
            height={10}
          />
        )}
      </button>

      {open && (
        <div
          className={`absolute right-0 z-50 analytics-calendar ${singleMonth ? 'single-month' : ''}`}
          style={{ top: 'calc(100% + 4px)', width: singleMonth ? 504 : 900 }}
        >
          <DateRangePicker
            ranges={pendingRange}
            onChange={(item) => setPendingRange([item.selection])}
            staticRanges={staticRanges}
            inputRanges={[]}
            months={singleMonth ? 1 : 2}
            direction={singleMonth ? 'vertical' : 'horizontal'}
            rangeColors={['rgb(171,223,187)']}
            showMonthAndYearPickers={false}
            showDateDisplay={false}
            className='PreviewArea'
          />

          <div className='calendar-bottom-container'>
            <div
              className='calendar-cancel-button-container'
              onClick={handleCancel}
            >
              <span className='calendar-cancel-span'>Cancel</span>
            </div>
            <div
              className='calendar-apply-button-container'
              onClick={handleApply}
            >
              <span className='calendar-apply-span'>Apply</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
