/**
 * Get today's date in ISO 8601 format (YYYY-MM-DD)
 * Uses UTC to ensure consistency across timezones
 */
export function getTodayISO(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

/**
 * Get current timestamp in ISO 8601 format
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Check if a date string represents today
 * @param dateString ISO 8601 date string to check
 * @returns true if the date is today
 */
export function isToday(dateString: string): boolean {
  const today = getTodayISO();
  const inputDate = dateString.split("T")[0];
  return inputDate === today;
}
