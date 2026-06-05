export function getPersistedDateRange() {
  try {
    const saved = localStorage.getItem('analytics_date_range');
    if (!saved) return null;
    const { startDate, endDate } = JSON.parse(saved);
    return {
      fromDate: startDate.split('T')[0],
      toDate: endDate.split('T')[0],
    };
  } catch {
    return null;
  }
}
