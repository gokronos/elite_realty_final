import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PriceType, Property, PropertyStatus } from "@/types";

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

  const parts = uniqueLocationParts([
    location.neighborhood,
    location.city,
    location.state,
  ]);

  if (parts.length === 0) {
    return "Location on file";
  }

  return parts.join(", ");
}

export function isForSaleStatus(status?: PropertyStatus | string): boolean {
  return status === "forSale" || status === "active-sale";
}

export function isForRentStatus(status?: PropertyStatus | string): boolean {
  return status === "forRent" || status === "active-rental";
}

export function isActivePropertyStatus(status?: PropertyStatus | string): boolean {
  return isForSaleStatus(status) || isForRentStatus(status);
}

export function isMonthlyRentPrice(priceType?: PriceType | string): boolean {
  return priceType === "monthlyRent" || priceType === "rent";
}

export function getPropertySquareFeet(property: Pick<Property, "squareFeet" | "sqft">): number | undefined {
  return property.squareFeet ?? property.sqft;
}

export function formatPropertyLocationFromProperty(
  property: Pick<
    Property,
    "title" | "market" | "communityOrBuilding" | "city" | "state" | "location"
  >
): string {
  const communityAlreadyInTitle =
    property.communityOrBuilding &&
    normalizedText(property.title).includes(normalizedText(property.communityOrBuilding));

  const parts = uniqueLocationParts([
    communityAlreadyInTitle ? undefined : property.communityOrBuilding,
    property.market ?? property.location?.neighborhood,
    property.city ?? property.location?.city,
    property.state ?? property.location?.state,
  ]);

  return parts.length > 0 ? parts.join(", ") : "Location on file";
}

function normalizedText(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

function uniqueLocationParts(parts: Array<string | undefined>): string[] {
  const seen = new Set<string>();

  return parts.filter((part): part is string => {
    if (!part) return false;
    const normalized = part.trim().toLowerCase();
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}
