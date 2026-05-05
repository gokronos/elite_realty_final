"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

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
    video: "/videos/hero-1.mp4",
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
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Notify parent of slide changes
  useEffect(() => {
    onSlideChange?.(currentIndex, isTransitioning);
  }, [currentIndex, isTransitioning, onSlideChange]);

  // Preload adjacent videos
  useEffect(() => {
    const next = (currentIndex + 1) % slides.length;
    const prev = (currentIndex - 1 + slides.length) % slides.length;
    setPreloadedVideos(prev => new Set([...prev, currentIndex, next, prev]));
  }, [currentIndex]);

  // Check if mobile on mount
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Rotate slides
  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, FADE_DURATION);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // Play current video when it becomes active
  useEffect(() => {
    if (!isMobile && isClient) {
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
  }, [currentIndex, isMobile, isClient]);

  // Show fallback image during SSR
  if (!isClient) {
    return (
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-beach.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
    );
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
            {/* Desktop: Video - only render if preloaded */}
            {!isMobile && slide.video && preloadedVideos.has(index) && (
              <video
                ref={(el) => { videoRefs.current[index] = el; }}
                src={slide.video}
                poster={slide.poster}
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Mobile: Image only */}
            {isMobile && (
              <Image
                src={slide.image}
                alt=""
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            )}

            {/* Fallback image for video (hidden but preloaded) */}
            {!isMobile && (
              <div className="absolute inset-0 -z-10">
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (index !== currentIndex) {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsTransitioning(false);
                }, FADE_DURATION / 2);
              }
            }}
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
