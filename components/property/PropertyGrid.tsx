import { PropertyCard } from "./PropertyCard";
import type { Property, PropertyCard as PropertyCardType } from "@/types";

interface PropertyGridProps {
  properties: (Property | PropertyCardType)[];
  groupHistoricalByYear?: boolean;
}

function renderPropertyCards(properties: (Property | PropertyCardType)[]) {
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

export function PropertyGrid({ properties, groupHistoricalByYear = false }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[#a0a0a0] text-lg">No properties found</p>
      </div>
    );
  }

  if (!groupHistoricalByYear) {
    return renderPropertyCards(properties);
  }

  const currentListings = properties.filter(
    (property) => property.status === "active-sale" || property.status === "active-rental"
  );
  const historicalByYear = new Map<string, (Property | PropertyCardType)[]>();
  const undatedHistorical: (Property | PropertyCardType)[] = [];

  for (const property of properties) {
    if (property.status === "active-sale" || property.status === "active-rental") {
      continue;
    }

    const year = "yearTransacted" in property ? property.yearTransacted : undefined;
    if (!year) {
      undatedHistorical.push(property);
      continue;
    }

    const key = String(year);
    const existing = historicalByYear.get(key);
    if (existing) {
      existing.push(property);
      continue;
    }

    historicalByYear.set(key, [property]);
  }

  return (
    <div className="space-y-12">
      {currentListings.length > 0 && (
        <div>
          <div className="mb-6 border-b border-[#2d2d2d] pb-3">
            <h2 className="font-serif text-2xl text-white tracking-wide">Current Listings</h2>
          </div>
          {renderPropertyCards(currentListings)}
        </div>
      )}

      {Array.from(historicalByYear.entries()).map(([year, yearProperties]) => (
        <div key={year}>
          <div className="mb-6 border-b border-[#2d2d2d] pb-3">
            <h2 className="font-serif text-2xl text-white tracking-wide">{year}</h2>
          </div>
          {renderPropertyCards(yearProperties)}
        </div>
      ))}

      {undatedHistorical.length > 0 && (
        <div>
          <div className="mb-6 border-b border-[#2d2d2d] pb-3">
            <h2 className="font-serif text-2xl text-white tracking-wide">Past Transactions</h2>
          </div>
          {renderPropertyCards(undatedHistorical)}
        </div>
      )}
    </div>
  );
}
