"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyFilter } from "@/components/property/PropertyFilter";
import { PropertyModal } from "@/components/property/PropertyModal";
import { isForRentStatus, isForSaleStatus } from "@/lib/utils";
import type { Property, PropertyStatus, PropertyType, State } from "@/types";

interface PropertyClientProps {
  properties: Property[];
  groupHistoricalByYear?: boolean;
}

interface PropertyClientViewProps extends PropertyClientProps {
  initialStatus: PropertyStatus | "all";
  initialPropertyType: PropertyType | "all";
}

function PropertyClientView({
  properties,
  groupHistoricalByYear = false,
  initialStatus,
  initialPropertyType,
}: PropertyClientViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<PropertyStatus | "all">(initialStatus);
  const [propertyType, setPropertyType] = useState<PropertyType | "all">(initialPropertyType);
  const [state, setState] = useState<State | "all">("all");

  const selectedProperty = useMemo(() => {
    const propertySlug = searchParams.get("property");
    if (!propertySlug) return null;

    return properties.find(
      (property) => property.slug?.current === propertySlug || property._id === propertySlug
    ) ?? null;
  }, [searchParams, properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (status !== "all") {
        if (status === "forSale" && !isForSaleStatus(property.status)) return false;
        else if (status === "forRent" && !isForRentStatus(property.status)) return false;
        else if (status !== "forSale" && status !== "forRent" && property.status !== status) return false;
      }
      if (propertyType !== "all" && property.propertyType !== propertyType) return false;
      if (state !== "all" && (property.state ?? property.location?.state) !== state) return false;
      return true;
    });
  }, [properties, status, propertyType, state]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <section className="pt-32 pb-8 px-4">
        <div className="container mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 tracking-wide">
            Property
          </h1>
          <p className="text-[#a0a0a0] text-lg max-w-2xl">
            Browse our collection of luxury properties in Puerto Rico and Miami
          </p>
          <p className="text-[#6b6b6b] text-sm mt-2">
            {filteredProperties.length} of {properties.length} properties
          </p>
        </div>
      </section>

      {/* Filters & Grid */}
      <section className="pb-24 px-4">
        <div className="container mx-auto">
          <PropertyFilter
            status={status}
            propertyType={propertyType}
            state={state}
            onStatusChange={setStatus}
            onTypeChange={setPropertyType}
            onStateChange={setState}
          />

          <PropertyGrid
            properties={filteredProperties}
            groupHistoricalByYear={groupHistoricalByYear}
          />
        </div>
      </section>

      {/* Property Modal */}
      <PropertyModal
        key={selectedProperty?._id ?? "empty-property-modal"}
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("property");
          const query = params.toString();
          router.replace(query ? `/property?${query}` : "/property", { scroll: false });
        }}
      />
    </div>
  );
}

function PropertyClientContent({ properties, groupHistoricalByYear = false }: PropertyClientProps) {
  const searchParams = useSearchParams();
  const urlStatus = searchParams.get("status") as PropertyStatus | null;
  const urlType = searchParams.get("type") as PropertyType | null;

  return (
    <PropertyClientView
      key={`${urlStatus ?? "all"}-${urlType ?? "all"}`}
      properties={properties}
      groupHistoricalByYear={groupHistoricalByYear}
      initialStatus={urlStatus ?? "all"}
      initialPropertyType={urlType ?? "all"}
    />
  );
}

export function PropertyClient({ properties, groupHistoricalByYear = false }: PropertyClientProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <PropertyClientContent
        properties={properties}
        groupHistoricalByYear={groupHistoricalByYear}
      />
    </Suspense>
  );
}
