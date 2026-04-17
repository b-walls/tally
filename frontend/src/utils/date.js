export function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

export function toLocalDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayRange() {
  const now = new Date();
  return [now, now]
}

export function getWeekRange() {
  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  return [startOfWeek, endOfWeek]
}

export function getMonthRange() {
  const now = new Date();

  const startOfMonth = new Date(now);
  startOfMonth.setDate(1);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth((endOfMonth.getMonth() + 1) % 12, 0);

  return [startOfMonth, endOfMonth]
}

export function getLastMonthRange() {
  const now = new Date();

  const endOfMonth = new Date(now);
  endOfMonth.setDate(0);

  const startOfMonth = new Date(endOfMonth);
  startOfMonth.setDate(1);

  return [startOfMonth, endOfMonth]
}

export function getLast3MonthRange() {
  const now = new Date();

  const endOf3Months = new Date(now);
  endOf3Months.setMonth(endOf3Months.getMonth() + 1, 0);

  const startOf3Months = new Date(now);
  startOf3Months.setMonth((startOf3Months.getMonth() - 2) % 12, 1);

  return [startOf3Months, endOf3Months]
}

export function getThisYearRange() {
  const now = new Date();

  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear() + 1, 0, 0);

  return [startOfYear, endOfYear];
}