// DATE → "20 Apr 2026"
export const formatDate = (dateStr) => {
  if (!dateStr || dateStr === '----' || dateStr === 'Multiple') return dateStr;

  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// PRICE → "124,50 kr"
export const formatPrice = (value) => {
  if (value === null || value === undefined) return '--';

  return (
    Number(value).toLocaleString('nb-NO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' kr'
  );
};
