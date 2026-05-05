"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface SlideMedia {
  video?: string;
  image: string;
  poster?: string;
  label: string;
  heading: string;
  subheading: string;
}

const slides: SlideMedia[] = [
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

const SLIDE_DURATION = 8000; // 8 seconds
const FADE_DURATION = 1500; // 1.5 seconds

export function HeroBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Default to desktop (videos)
  const [isClient, setIsClient] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Check if mobile on mount
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
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
            {/* Desktop: Video */}
            {!isMobile && slide.video && (
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

      {/* Slide Text Content */}
      <div className="absolute inset-x-0 z-20 flex flex-col items-center px-4 text-center pointer-events-none" style={{ top: "30%", transform: "translateY(-65%)" }}>
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={index}
              className="absolute w-full transition-all duration-700"
              style={{
                opacity: isActive ? (isTransitioning ? 0 : 1) : 0,
                transform: isActive && !isTransitioning ? "translateY(0)" : "translateY(12px)",
              }}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-6">
                {slide.label}
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-[-0.02em] leading-[1.1] text-white mb-4">
                {slide.heading}
              </h1>
              <div className="w-16 h-0.5 bg-[#d4af37] mx-auto mb-6" />
              <p className="text-lg sm:text-xl text-white/70 max-w-xl mx-auto">
                {slide.subheading}
              </p>
            </div>
          );
        })}
      </div>

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
