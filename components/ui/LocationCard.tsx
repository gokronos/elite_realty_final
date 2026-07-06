"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface LocationCardProps {
  name: string;
  slug: string;
  image: string;
  description?: string;
  variant?: "compact" | "detailed";
}

export function LocationCard({
  name,
  slug,
  image,
  description,
  variant = "compact"
}: LocationCardProps) {
  const [imageError, setImageError] = useState(false);

  if (variant === "detailed") {
    return (
      <Link
        href={`/locations/${slug}`}
        className="group block overflow-hidden"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#1a1a1a]">
          {imageError ? (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
              <div className="absolute inset-0 bg-[#d4af37]/5" />
            </div>
          ) : (
            <Image
              src={image}
              alt={`${name} - Elite Realty`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 p-6">
            <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-light uppercase tracking-wider text-center mb-4">
              {name}
            </h3>
            {description && (
              <p className="mb-4 max-w-sm text-center text-sm leading-relaxed text-white/80">
                {description}
              </p>
            )}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white text-white uppercase text-xs tracking-widest px-6 py-2 hover:bg-white hover:text-black">
              Explore
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Compact variant (homepage)
  return (
    <Link
      href={`/locations/${slug}`}
      className="group relative aspect-[4/3] overflow-hidden"
    >
      {/* Image or Fallback */}
      {imageError ? (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
          <div className="absolute inset-0 bg-[#d4af37]/5" />
        </div>
      ) : (
        <Image
          src={image}
          alt={`${name} - Elite Realty`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => setImageError(true)}
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white uppercase tracking-wider mb-4">
          {name}
        </h3>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs uppercase tracking-[0.2em] text-white border border-white px-4 py-2">
          Explore Homes
        </span>
      </div>
    </Link>
  );
}
