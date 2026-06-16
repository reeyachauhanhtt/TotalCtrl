// import { format } from 'date-fns';

// const STORAGE_KEY = 'analytics_date_range';

// function normalizeStoredDate(value) {
//   if (!value) return '';

//   if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
//     return value;
//   }

//   return format(new Date(value), 'yyyy-MM-dd');
// }

// export function getPersistedDateRange() {
//   try {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     if (!saved) return null;

//     const { startDate, endDate, label } = JSON.parse(saved);

//     return {
//       fromDate: normalizeStoredDate(startDate),
//       toDate: normalizeStoredDate(endDate),
//       label,
//     };
//   } catch {
//     return null;
//   }
// }

import { format } from 'date-fns';

function normalizeStoredDate(value) {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return format(new Date(value), 'yyyy-MM-dd');
}

export function getPersistedDateRange(storageKey = 'analytics_date_range') {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return null;

    const { startDate, endDate, label } = JSON.parse(saved);

    return {
      fromDate: normalizeStoredDate(startDate),
      toDate: normalizeStoredDate(endDate),
      label,
    };
  } catch {
    return null;
  }
}
