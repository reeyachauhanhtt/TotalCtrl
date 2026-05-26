/**
 * Validates a date object with { day, month, year } fields.
 * Returns an errors object: { day?: string, month?: string, year?: string }
 * An empty object means the date is valid.
 */
export function validateDate(date) {
  const errors = {};
  const day = Number(date.day);
  const month = Number(date.month);
  const year = Number(date.year);

  if (!date.day || date.day === '') {
    errors.day = 'Required';
  } else if (!Number.isInteger(day) || day < 1 || day > 31) {
    errors.day = 'Invalid day';
  }

  if (!date.month || date.month === '') {
    errors.month = 'Required';
  } else if (!Number.isInteger(month) || month < 1 || month > 12) {
    errors.month = 'Invalid month';
  }

  if (!date.year || date.year === '') {
    errors.year = 'Required';
  } else if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    errors.year = 'Invalid year';
  }

  // Cross-field: check the day is valid for the given month/year
  if (!errors.day && !errors.month && !errors.year) {
    const testDate = new Date(year, month - 1, day);
    if (
      testDate.getFullYear() !== year ||
      testDate.getMonth() !== month - 1 ||
      testDate.getDate() !== day
    ) {
      errors.day = `Day ${day} doesn't exist in this month`;
    }
  }

  return errors;
}

/**
 * Validates both orderedOn and scheduledFor.
 * Returns { orderedOn: {}, scheduledFor: {} } — empty sub-objects = valid.
 */
export function validateOrderDates({ orderedOn, scheduledFor }) {
  return {
    orderedOn: validateDate(orderedOn),
    scheduledFor: validateDate(scheduledFor),
  };
}

/**
 * Returns true if the validation result from validateOrderDates has no errors.
 */
export function isOrderDatesValid(validationResult) {
  return (
    Object.keys(validationResult.orderedOn).length === 0 &&
    Object.keys(validationResult.scheduledFor).length === 0
  );
}
