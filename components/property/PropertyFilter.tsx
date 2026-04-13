"use client";

import { cn } from "@/lib/utils";
import type { PropertyStatus, PropertyType, State } from "@/types";

interface FilterOption<T> {
  value: T | "all";
  label: string;
}

const statusOptions: FilterOption<PropertyStatus>[] = [
  { value: "all", label: "All Status" },
  { value: "active-sale", label: "For Sale" },
  { value: "active-rental", label: "For Rent" },
  { value: "sold", label: "Sold" },
  { value: "rented", label: "Rented" },
];

const typeOptions: FilterOption<PropertyType>[] = [
  { value: "all", label: "All Types" },
  { value: "condo", label: "Condo" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "land", label: "Land" },
];

const stateOptions: FilterOption<State>[] = [
  { value: "all", label: "All Locations" },
  { value: "PR", label: "Puerto Rico" },
  { value: "FL", label: "Florida" },
];

interface PropertyFilterProps {
  status: PropertyStatus | "all";
  propertyType: PropertyType | "all";
  state: State | "all";
  onStatusChange: (status: PropertyStatus | "all") => void;
  onTypeChange: (type: PropertyType | "all") => void;
  onStateChange: (state: State | "all") => void;
}

export function PropertyFilter({
  status,
  propertyType,
  state,
  onStatusChange,
  onTypeChange,
  onStateChange,
}: PropertyFilterProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as PropertyStatus | "all")}
        className={cn(
          "px-4 py-3 bg-[#1a1a1a] border border-[#2d2d2d] text-white",
          "focus:outline-none focus:border-white transition-colors",
          "cursor-pointer"
        )}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Type Filter */}
      <select
        value={propertyType}
        onChange={(e) => onTypeChange(e.target.value as PropertyType | "all")}
        className={cn(
          "px-4 py-3 bg-[#1a1a1a] border border-[#2d2d2d] text-white",
          "focus:outline-none focus:border-white transition-colors",
          "cursor-pointer"
        )}
      >
        {typeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* State Filter */}
      <select
        value={state}
        onChange={(e) => onStateChange(e.target.value as State | "all")}
        className={cn(
          "px-4 py-3 bg-[#1a1a1a] border border-[#2d2d2d] text-white",
          "focus:outline-none focus:border-white transition-colors",
          "cursor-pointer"
        )}
      >
        {stateOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
