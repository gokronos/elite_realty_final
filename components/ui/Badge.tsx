import { cn } from "@/lib/utils";
import type { PropertyStatus } from "@/types";

export interface BadgeProps {
  status: PropertyStatus;
  className?: string;
}

const statusConfig: Record<
  PropertyStatus,
  { label: string; className: string }
> = {
  forSale: {
    label: "For Sale",
    className: "bg-white text-black",
  },
  "active-sale": {
    label: "For Sale",
    className: "bg-white text-black",
  },
  forRent: {
    label: "For Rent",
    className: "bg-[#d4af37] text-black",
  },
  "active-rental": {
    label: "For Rent",
    className: "bg-[#d4af37] text-black",
  },
  sold: {
    label: "Sold",
    className: "bg-[#6b6b6b] text-white",
  },
  rented: {
    label: "Rented",
    className: "bg-[#6b6b6b] text-white",
  },
};

export function Badge({ status, className }: BadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
