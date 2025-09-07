/**
 * Format date to a readable string
 * @param {Date|string} date - The date to format
 * @param {string} format - The format type ('short', 'medium', 'long', 'full', 'custom')
 * @param {string} locale - The locale for formatting (default: 'en-US')
 * @returns {string} Formatted date string
 */
export const datePipe = (date, format = "medium", locale = "en-US") => {
  if (!date) return "";

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return "";

  const options = {
    short: {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
    medium: {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
    long: {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
    full: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
    shortDate: {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
    shortTime: {
      hour: "2-digit",
      minute: "2-digit",
    },
  };

  return dateObj.toLocaleDateString(locale, options[format] || options.medium);
};
