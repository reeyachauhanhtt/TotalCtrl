import { useRef } from 'react';

export default function DateFields({
  label,
  value,
  onChange,
  errors = {},
  onFieldBlur,
}) {
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  function handleChange(field, raw) {
    const maxLen = field === 'year' ? 4 : 2;
    const trimmed = raw.slice(0, maxLen);
    onChange({ ...value, [field]: trimmed });

    if (field === 'day' && trimmed.length === 2) monthRef.current?.focus();
    if (field === 'month' && trimmed.length === 2) yearRef.current?.focus();
  }

  function handleBlur(field, val) {
    if (!onFieldBlur) return;

    if (field === 'day') {
      const num = parseInt(val);
      if (!val) onFieldBlur(field, 'Day is required');
      else if (isNaN(num) || num < 1 || num > 31)
        onFieldBlur(field, 'Date is invalid');
      else onFieldBlur(field, undefined);
    }

    if (field === 'month') {
      const num = parseInt(val);
      if (!val) onFieldBlur(field, 'Month is required');
      else if (isNaN(num) || num < 1 || num > 12)
        onFieldBlur(field, 'Month is invalid');
      else onFieldBlur(field, undefined);
    }

    if (field === 'year') {
      const num = parseInt(val);
      if (!val) onFieldBlur(field, 'Year is required');
      else if (isNaN(num) || val.length < 4 || num < 1900)
        onFieldBlur(field, 'Invalid year');
      else onFieldBlur(field, undefined);
    }
  }

  const inputBase =
    'border rounded px-4 py-3 text-[13px] leading-6 text-[#333] outline-none';
  const errorClass = 'bg-[#fff7f7] border-[#fc5c63] shadow-[0_0_0_1px_#fc5c63]';
  const normalClass = 'border-[#d7d8e0]';

  return (
    <div>
      <label className='block font-semibold text-[18px] leading-6 tracking-[-0.01em] text-[#19191c] mb-3'>
        {label}
      </label>
      <div className='flex items-start gap-4'>
        {/* Day */}
        <div>
          <label className='block font-semibold text-[11px] leading-4 uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
            Day*
          </label>
          <input
            type='text'
            inputMode='numeric'
            placeholder='dd'
            maxLength={2}
            value={value.day}
            onChange={(e) =>
              handleChange('day', e.target.value.replace(/\D/g, ''))
            }
            onBlur={(e) => handleBlur('day', e.target.value)}
            className={`${inputBase} ${errors.day ? errorClass : normalClass}`}
            style={{ width: '70px' }}
          />
        </div>

        {/* Month */}
        <div>
          <label className='block font-semibold text-[11px] leading-4 uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
            Month*
          </label>
          <input
            ref={monthRef}
            type='text'
            inputMode='numeric'
            placeholder='mm'
            maxLength={2}
            value={value.month}
            onChange={(e) =>
              handleChange('month', e.target.value.replace(/\D/g, ''))
            }
            onBlur={(e) => handleBlur('month', e.target.value)}
            className={`${inputBase} ${errors.month ? errorClass : normalClass}`}
            style={{ width: '72px' }}
          />
        </div>

        {/* Year */}
        <div>
          <label className='block font-semibold text-[11px] leading-4 uppercase text-[#6b6b6f] tracking-[0.08em] mb-1'>
            Year*
          </label>
          <input
            ref={yearRef}
            type='text'
            inputMode='numeric'
            placeholder='yyyy'
            maxLength={4}
            value={value.year}
            onChange={(e) =>
              handleChange('year', e.target.value.replace(/\D/g, ''))
            }
            onBlur={(e) => handleBlur('year', e.target.value)}
            className={`${inputBase} ${errors.year ? errorClass : normalClass}`}
            style={{ width: '166px' }}
          />
        </div>
      </div>

      {(errors.day || errors.month || errors.year) && (
        <p
          style={{
            display: 'block',
            color: '#d93a3f',
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 600,
            paddingTop: '8px',
          }}
        >
          Date is invalid
        </p>
      )}
    </div>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────────
export const emptyDate = () => ({ day: '', month: '', year: '' });
export const emptyDateErrors = () => ({
  day: undefined,
  month: undefined,
  year: undefined,
});
