"use client";

import { useState, useEffect, useCallback } from "react";
import type { SlideMedia } from "./HeroBackground";
import { HERO_SLIDE_DURATION } from "./HeroBackground";

interface HeroContentProps {
  slides: SlideMedia[];
  fadeDuration: number;
}

export function HeroContent({ slides, fadeDuration }: HeroContentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, fadeDuration);
  }, [slides.length, fadeDuration]);

  useEffect(() => {
    const interval = setInterval(nextSlide, HERO_SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative w-full max-w-5xl mx-auto px-6" style={{ minHeight: "260px" }}>
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={index}
            className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-700"
            style={{
              opacity: isActive ? (isTransitioning ? 0 : 1) : 0,
              transform: isActive && !isTransitioning ? "translateY(0)" : "translateY(12px)",
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/80 mb-4 sm:mb-6">
              {slide.label}
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[-0.02em] leading-[1.1] text-white mb-4">
              {slide.heading}
            </h1>
            <div className="w-16 h-0.5 bg-[#d4af37] mx-auto mb-4 sm:mb-6" />
            <p className="text-base sm:text-xl text-white/70 max-w-xl mx-auto">
              {slide.subheading}
            </p>
          </div>
        );
      })}
    </div>
  );
}
