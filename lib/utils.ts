import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 * Handles conditional classes and resolves conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price for display
 */
export function formatPrice(price: number | null | undefined): string {
  if (!price) return "Contact for Price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format date for display
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a whole number using a stable locale for SSR/CSR consistency
 */
export function formatWholeNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format property location with graceful fallbacks for historical records
 */
export function formatPropertyLocation(location?: {
  neighborhood?: string;
  city?: string;
  state?: string;
}): string {
  if (!location) return "Location on file";

  const parts = [location.neighborhood, location.city, location.state].filter(Boolean);

  if (parts.length === 0) {
    return "Location on file";
  }

  return parts.join(", ");
}
