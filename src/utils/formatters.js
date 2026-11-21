// Shared display formatters.
import { CURRENCY_SYMBOL } from "./constants";

// Sri Lankan style: "Rs 14,500", or "Rs 14,500.50" when there are cents.
const wholeFormatter = new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 });
const centsFormatter = new Intl.NumberFormat("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatPrice(amount) {
  const value = Number(amount) || 0;
  const formatter = Number.isInteger(value) ? wholeFormatter : centsFormatter;
  return `${CURRENCY_SYMBOL} ${formatter.format(value)}`;
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
