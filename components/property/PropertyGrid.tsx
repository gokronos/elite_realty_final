import { PropertyCard } from "./PropertyCard";
import type { Property, PropertyCard as PropertyCardType } from "@/types";

interface PropertyGridProps {
  properties: (Property | PropertyCardType)[];
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[#a0a0a0] text-lg">No properties found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          property={property}
        />
      ))}
    </div>
  );
}
