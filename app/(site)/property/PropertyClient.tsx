"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyFilter } from "@/components/property/PropertyFilter";
import { PropertyModal } from "@/components/property/PropertyModal";
import type { Property, PropertyStatus, PropertyType, State } from "@/types";

interface PropertyClientProps {
  properties: Property[];
}

function PropertyClientContent({ properties }: PropertyClientProps) {
  const searchParams = useSearchParams();

  // Initialize status filter from URL ?status= param
  const urlStatus = searchParams.get("status") as PropertyStatus | null;
  const [status, setStatus] = useState<PropertyStatus | "all">(
    urlStatus ?? "all"
  );
  const [propertyType, setPropertyType] = useState<PropertyType | "all">("all");
  const [state, setState] = useState<State | "all">("all");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Sync status filter when URL param changes (e.g. clicking nav dropdown)
  useEffect(() => {
    const s = searchParams.get("status") as PropertyStatus | null;
    setStatus(s ?? "all");
  }, [searchParams]);

  // Open modal if property ID is in URL query
  useEffect(() => {
    const propertyId = searchParams.get("property");
    if (propertyId) {
      const property = properties.find((p) => p._id === propertyId);
      if (property) {
        setSelectedProperty(property);
      }
    }
  }, [searchParams, properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (status !== "all" && property.status !== status) return false;
      if (propertyType !== "all" && property.propertyType !== propertyType) return false;
      if (state !== "all" && property.location.state !== state) return false;
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

          <PropertyGrid properties={filteredProperties} />
        </div>
      </section>

      {/* Property Modal */}
      <PropertyModal
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </div>
  );
}

export function PropertyClient({ properties }: PropertyClientProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <PropertyClientContent properties={properties} />
    </Suspense>
  );
}
