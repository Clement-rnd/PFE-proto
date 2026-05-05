const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function daysInMonth(month: number, year: number): number {
  if (month === 2) {
    const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return leap ? 29 : 28;
  }
  return DAYS_IN_MONTH[month - 1] ?? 31;
}

export function formatDate(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length === 0) return '';

  const ddRaw = digits.slice(0, 2);
  const mmRaw = digits.slice(2, 4);
  const yyyyRaw = digits.slice(4, 8);

  // Day: clamp 01-31 once both digits are entered
  let dd = ddRaw;
  if (ddRaw.length === 2) {
    const n = Math.max(1, Math.min(31, parseInt(ddRaw, 10)));
    dd = n.toString().padStart(2, '0');
  }

  if (mmRaw.length === 0) return dd;

  // Month: clamp 01-12 once both digits are entered
  let mm = mmRaw;
  if (mmRaw.length === 2) {
    const n = Math.max(1, Math.min(12, parseInt(mmRaw, 10)));
    mm = n.toString().padStart(2, '0');
  }

  if (yyyyRaw.length === 0) return `${dd}/${mm}`;

  // Year: clamp to max 2026 once all 4 digits are entered
  let yyyy = yyyyRaw;
  if (yyyyRaw.length === 4) {
    const y = Math.max(1900, Math.min(2026, parseInt(yyyyRaw, 10)));
    yyyy = y.toString();

    // Recalculate max day once month + year are both known
    if (mmRaw.length === 2) {
      const maxDay = daysInMonth(parseInt(mm, 10), y);
      if (parseInt(dd, 10) > maxDay) {
        dd = maxDay.toString().padStart(2, '0');
      }
    }
  }

  return `${dd}/${mm}/${yyyy}`;
}

export function isDateComplete(date: string): boolean {
  return date.length === 10;
}
