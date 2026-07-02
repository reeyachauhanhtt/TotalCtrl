const BADGE_VARIANTS = {
  // Order statuses
  scheduled: { bg: '#e7e7ec', color: '#57575b', label: 'Scheduled' },
  'partially delivered': {
    bg: '#fff4bd',
    color: '#a08700',
    label: 'Partially Delivered',
  },
  'partially-delivered': {
    bg: '#fff4bd',
    color: '#a08700',
    label: 'Partially Delivered',
  },
  delivered: { bg: '#eaf7ee', color: '#0f6f36', label: 'Delivered' },

  // Inventory statuses
  active: { bg: '#dcf1e3', color: '#0f6f36', label: 'Active' },
  deactivated: { bg: '#e7e7ec', color: '#57575b', label: 'Deactivated' },
  deactived: { bg: '#e7e7ec', color: '#57575b', label: 'Deactivated' },
  inactive: { bg: '#e7e7ec', color: '#57575b', label: 'Deactivated' },

  // Inventory row — expiry / days left
  expired: { bg: '#fde8e8', color: '#c0392b', label: 'Expired' },
  'out of stock': { bg: '#e7e7ec', color: '#57575b', label: 'Out of Stock' },
  days_left: { bg: '#e6e3ff', color: '#362a96' },

  // Item templates
  duplicate: { bg: '#ffe3e5', color: '#a71a23' },
};

export default function StatusBadge({ variant, label, className = '' }) {
  const key = variant?.toLowerCase();
  const style = BADGE_VARIANTS[key] ?? { bg: '#e7e7ec', color: '#57575b' };
  const displayLabel = label ?? style.label ?? variant;

  return (
    <span
      style={{ backgroundColor: style.bg, color: style.color }}
      className={`inline-block text-[11px] font-bold uppercase tracking-[0.08em] leading-4 px-2 py-0.5 rounded whitespace-nowrap ${className}`}
    >
      {displayLabel}
    </span>
  );
}
