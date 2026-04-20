"use client";

import { useRef } from "react";
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

  const scrollByCard = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const card = container.querySelector("[data-carousel-card]") as HTMLElement | null;
    const cardWidth = card?.offsetWidth || 320;
    const gap = 24;

    container.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-end gap-2 mb-5">
        <button
          type="button"
          onClick={() => scrollByCard("left")}
          className="h-10 w-10 flex items-center justify-center rounded-sm border border-[#2b2b2b] bg-[#111111] text-white hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
          aria-label="Desplazar carrusel a la izquierda"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard("right")}
          className="h-10 w-10 flex items-center justify-center rounded-sm border border-[#2b2b2b] bg-[#111111] text-white hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
          aria-label="Desplazar carrusel a la derecha"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth"
        aria-label={ariaLabel}
      >
        {properties.map((property) => (
          <div
            key={property._id}
            data-carousel-card
            className="min-w-[85%] sm:min-w-[58%] lg:min-w-[32%] snap-start"
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
