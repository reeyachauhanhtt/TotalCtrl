import { useRef, useEffect } from 'react';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { enUS } from 'date-fns/locale';
import './ExpiryDatePicker.css';

export default function ExpiryDatePicker({ selected, onChange, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div className='expiry-cal-wrapper' ref={ref}>
      <Calendar
        date={selected || new Date()}
        onChange={(date) => {
          onChange(date);
          onClose();
        }}
        color='#23a956'
        locale={{
          ...enUS,
          localize: {
            ...enUS.localize,
            month: (n) =>
              [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ][n],
          },
        }}
      />
    </div>
  );
}
