"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PropertyCard } from "@/components/property/PropertyCard";
import type { FeaturedProperty } from "@/types";

interface InformativePropertyCarouselProps {
  properties: FeaturedProperty[];
  ariaLabel: string;
}

export function InformativePropertyCarousel({
  properties,
  ariaLabel,
}: InformativePropertyCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getCardWidth = (): number => {
    const container = containerRef.current;
    if (!container) return 320;
    const card = container.querySelector("[data-carousel-card]") as HTMLElement | null;
    if (!card) return 320;
    // offsetWidth of card + gap (gap-6 = 24px)
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
      {/* Arrow controls */}
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

      {/* Scrollable track — no snap to allow reliable programmatic scroll */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto pb-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
