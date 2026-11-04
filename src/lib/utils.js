import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely using clsx + tailwind-merge
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number to Nigerian Naira. Returns "Free" for 0.
 */
export function formatCurrencyNGN(amount) {
  if (!amount || amount === 0) return "Free";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Truncates text to a given character length with ellipsis.
 */
export function truncate(text, length = 120) {
  if (!text || text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}

/**
 * Returns the ISO date string formatted as "Nov 4, 2026"
 */
export function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Returns word count of a string
 */
export function wordCount(text) {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}
