"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyCard } from "@/components/property/PropertyCard";
import type { FeaturedProperty } from "@/types";

interface InformativePropertyCarouselProps {
  properties: FeaturedProperty[];
  ariaLabel: string;
  groupByYear?: boolean;
}

interface CarouselTrackProps {
  properties: FeaturedProperty[];
  ariaLabel: string;
}

function CarouselTrack({ properties, ariaLabel }: CarouselTrackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getCardWidth = (): number => {
    const container = containerRef.current;
    if (!container) return 320;
    const card = container.querySelector("[data-carousel-card]") as HTMLElement | null;
    if (!card) return 320;
    return card.offsetWidth + 24;
  };

  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const clamped = Math.max(0, Math.min(index, properties.length - 1));
    container.scrollTo({ left: clamped * getCardWidth(), behavior: "smooth" });
    setCurrentIndex(clamped);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-end gap-2 mb-5">
        <button
          type="button"
          onClick={() => scrollToIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="h-10 w-10 flex items-center justify-center rounded-sm border border-[#2b2b2b] bg-[#111111] text-white hover:border-[#d4af37] hover:text-[#d4af37] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollToIndex(currentIndex + 1)}
          disabled={currentIndex >= properties.length - 1}
          className="h-10 w-10 flex items-center justify-center rounded-sm border border-[#2b2b2b] bg-[#111111] text-white hover:border-[#d4af37] hover:text-[#d4af37] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="no-scrollbar flex gap-6 overflow-x-auto pb-3"
        aria-label={ariaLabel}
      >
        {properties.map((property) => (
          <div
            key={property._id}
            data-carousel-card
            className="min-w-[85%] sm:min-w-[58%] lg:min-w-[32%] flex-shrink-0"
          >
            <PropertyCard
              property={property}
              disableLink
              hidePrice
              hideShare
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function groupPropertiesByYear(properties: FeaturedProperty[]) {
  const groups = new Map<string, FeaturedProperty[]>();

  for (const property of properties) {
    const key = property.yearTransacted ? String(property.yearTransacted) : "Past Transactions";
    const existing = groups.get(key);
    if (existing) {
      existing.push(property);
      continue;
    }
    groups.set(key, [property]);
  }

  return Array.from(groups.entries()).map(([label, items]) => ({
    label,
    items,
  }));
}

export function InformativePropertyCarousel({
  properties,
  ariaLabel,
  groupByYear = false,
}: InformativePropertyCarouselProps) {
  if (!groupByYear) {
    return <CarouselTrack properties={properties} ariaLabel={ariaLabel} />;
  }

  const groups = groupPropertiesByYear(properties);

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <div key={group.label}>
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-[#2b2b2b] pb-3">
            <h3 className="font-serif text-2xl text-white tracking-wide">{group.label}</h3>
          </div>
          <CarouselTrack
            properties={group.items}
            ariaLabel={`${ariaLabel} - ${group.label}`}
          />
        </div>
      ))}
    </div>
  );
}
