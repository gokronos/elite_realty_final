"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface SlideMedia {
  video?: string;
  image: string;
  poster?: string;
  label: string;
  heading: string;
  subheading: string;
}

export const slides: SlideMedia[] = [
  {
    video: "/videos/hero-1.1.mp4",
    image: "/images/hero-beach.jpg",
    poster: "/images/hero-beach.jpg",
    label: "Luxury Real Estate",
    heading: "Elite Realty",
    subheading: "Passion · Trust · Experience",
  },
  {
    video: "/videos/hero-2.mp4",
    image: "/images/hero-beach.jpg",
    poster: "/images/hero-beach.jpg",
    label: "Puerto Rico & Miami",
    heading: "Luxury Living Redefined",
    subheading: "Waterfront estates & premium residences",
  },
  {
    video: "/videos/hero-3.mp4",
    image: "/images/hero-beach.jpg",
    poster: "/images/hero-beach.jpg",
    label: "Act 60 Opportunities",
    heading: "Invest With Confidence",
    subheading: "Exclusive markets, extraordinary returns",
  },
  {
    video: "/videos/hero-4.mp4",
    image: "/images/hero-beach.jpg",
    poster: "/images/hero-beach.jpg",
    label: "Personalized Service",
    heading: "Your Dream Home Awaits",
    subheading: "Let Alexandra guide you home",
  },
  {
    video: "/videos/hero-5.mp4",
    image: "/images/hero-beach.jpg",
    poster: "/images/hero-beach.jpg",
    label: "Exclusive Living",
    heading: "Where Luxury Meets Lifestyle",
    subheading: "Premier properties in the Caribbean & Miami",
  },
];

export const HERO_SLIDE_DURATION = 8000;
export const HERO_FADE_DURATION = 1500;

const SLIDE_DURATION = HERO_SLIDE_DURATION;
const FADE_DURATION = HERO_FADE_DURATION;

interface HeroBackgroundProps {
  onSlideChange?: (index: number, isTransitioning: boolean) => void;
}

export function HeroBackground({ onSlideChange }: HeroBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preloadedVideos, setPreloadedVideos] = useState<Set<number>>(new Set([0]));
  const [isClient, setIsClient] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Notify parent of slide changes
  useEffect(() => {
    onSlideChange?.(currentIndex, isTransitioning);
  }, [currentIndex, isTransitioning, onSlideChange]);

  // Preload adjacent videos
  useEffect(() => {
    const nextIdx = (currentIndex + 1) % slides.length;
    const prevIdx = (currentIndex - 1 + slides.length) % slides.length;
    setPreloadedVideos(current => new Set([...current, currentIndex, nextIdx, prevIdx]));
  }, [currentIndex]);

  // Hydration guard
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Rotate slides
  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, FADE_DURATION);
    }, SLIDE_DURATION);
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, FADE_DURATION / 2);
    startInterval();
  }, [currentIndex, startInterval]);

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, FADE_DURATION);
    startInterval();
  }, [startInterval]);

  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, FADE_DURATION);
    startInterval();
  }, [startInterval]);

  useEffect(() => {
    startInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startInterval]);

  // Play current video when it becomes active
  useEffect(() => {
    if (isClient) {
      videoRefs.current.forEach((video, index) => {
        if (video) {
          if (index === currentIndex) {
            video.currentTime = 0;
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                // Autoplay was prevented, try again after user interaction
                console.log('Video autoplay prevented');
              });
            }
          } else {
            video.pause();
          }
        }
      });
    }
  }, [currentIndex, isClient]);

  // Show dark background during SSR (prevents beach image flash)
  if (!isClient) {
    return <div className="absolute inset-0 z-0 bg-[#0a0a0a]" />;
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        const opacity = isActive ? (isTransitioning ? 0 : 1) : 0;

        return (
          <div
            key={index}
            className="absolute inset-0 transition-opacity"
            style={{
              opacity,
              transitionDuration: `${FADE_DURATION}ms`,
              zIndex: isActive ? 1 : 0,
            }}
          >
            {/* Video (all devices) - only render if preloaded */}
            {slide.video && preloadedVideos.has(index) && (
              <video
                ref={(el) => { videoRefs.current[index] = el; }}
                src={slide.video}
                autoPlay
                muted
                loop
                playsInline
                preload={index === 0 ? "auto" : "none"}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Dark background while video loads */}
            <div className="absolute inset-0 -z-10 bg-[#0a0a0a]" />
          </div>
        );
      })}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Arrow: Previous */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 border border-white/20 text-white hover:bg-black/60 hover:border-white/50 transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Arrow: Next */}
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 border border-white/20 text-white hover:bg-black/60 hover:border-white/50 transition-all duration-300"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white w-6"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
