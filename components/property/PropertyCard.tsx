"use client";

import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Ruler, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, formatPropertyLocation, formatWholeNumber } from "@/lib/utils";
import { urlFor } from "@/lib/sanity/image";
import type { Property, PropertyCard as PropertyCardType } from "@/types";

interface PropertyWithImageUrl extends PropertyCardType {
  featuredImageUrl?: string;
}

export interface PropertyCardProps {
  property: PropertyCardType | Property | PropertyWithImageUrl;
  className?: string;
  titleClassName?: string;
  disableLink?: boolean;
  hidePrice?: boolean;
  hideShare?: boolean;
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "active-sale":   return "FOR SALE";
    case "active-rental": return "FOR RENT";
    case "sold":          return "SOLD";
    case "rented":        return "RENTED";
    default:              return status.toUpperCase();
  }
}

function isActiveListing(status: string): boolean {
  return status === "active-sale" || status === "active-rental";
}

function handleShare(e: React.MouseEvent, title: string, href: string) {
  e.preventDefault();
  e.stopPropagation();
  const url = `${window.location.origin}${href}`;
  if (navigator.share) {
    navigator.share({ title, url }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(url);
  }
}

export function PropertyCard({
  property,
  className,
  titleClassName,
  disableLink = false,
  hidePrice = false,
  hideShare = false,
}: PropertyCardProps) {
  const propertyWithUrl = property as PropertyWithImageUrl;
  const imageUrl =
    urlFor(property.featuredImage)?.width(800).height(600).url() ||
    propertyWithUrl.featuredImageUrl ||
    "";

  const fullProperty = property as Property;
  const hasBeds  = fullProperty.bedrooms  !== undefined;
  const hasBaths = fullProperty.bathrooms !== undefined;
  const hasSqft  = fullProperty.sqft      !== undefined;
  const hasSpecs = hasBeds || hasBaths || hasSqft;
  const propertySlug = property.slug?.current || property._id;
  const propertyHref = isActiveListing(property.status)
    ? `/property/${encodeURIComponent(propertySlug)}`
    : `/property?property=${encodeURIComponent(propertySlug)}`;

  const cardContent = (
    <article
      className={cn(
        "group h-full rounded-sm overflow-hidden flex flex-col",
        "bg-[#111111] border border-[#1e1e1e]",
        disableLink
          ? "cursor-default"
          : "cursor-pointer hover:border-[#d4af37]/30 transition-all duration-300",
        className
      )}
    >
        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={property.featuredImage?.alt || property.title}
              fill
              className={cn(
                "object-cover transition-transform duration-500",
                !disableLink && "group-hover:scale-105"
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
              <span className="text-[#6b6b6b] text-sm">No image</span>
            </div>
          )}

          {/* Status Badge — top left */}
          <div className="absolute top-3 left-3">
            <span className="inline-block px-2.5 py-1 bg-[#d4af37] text-[#0a0a0a] text-[10px] font-bold uppercase tracking-widest">
              {getStatusLabel(property.status)}
            </span>
          </div>

          {/* Share button — top right */}
          {!hideShare && (
            <button
              onClick={(e) => handleShare(e, property.title, propertyHref)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/60 backdrop-blur-sm hover:bg-[#d4af37] hover:text-black text-white transition-colors duration-200 rounded-sm"
              aria-label="Compartir propiedad"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-4 pt-4 pb-5 flex flex-col flex-1 items-center text-center">
          {/* Location */}
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a8a8a] font-sans mb-2">
            {formatPropertyLocation(property.location)}
          </p>

          {/* Title */}
          <h3 className={cn(
            titleClassName,
            "font-doulos text-lg font-normal !text-[#a5a4a4] leading-snug mb-3 line-clamp-2 min-h-[3.25rem]",
            !disableLink && "group-hover:!text-[#d4af37] transition-colors duration-200"
          )}
          style={{ fontFamily: '"Doulos SIL", "Cormorant Garamond", Georgia, serif' }}>
            {property.title}
          </h3>

          {/* Price */}
          {!hidePrice && (
            <p className="text-2xl font-bold font-sans text-[#d4af37] mb-4">
              {formatPrice(property.price)}
              {property.priceType === "rent" && (
                <span className="text-sm text-[#a0a0a0] font-normal ml-1">/mo</span>
              )}
            </p>
          )}

          {/* Specs */}
          {hasSpecs && (
            <div className="mt-auto flex items-center justify-center flex-wrap gap-4 text-xs text-[#a0a0a0] border-t border-[#2a2a2a] pt-3 w-full">
              {hasBeds && (
                <span className="flex items-center gap-1.5">
                  <Bed className="w-3.5 h-3.5 text-[#6b6b6b]" />
                  {fullProperty.bedrooms} BD
                </span>
              )}
              {hasBaths && (
                <span className="flex items-center gap-1.5">
                  <Bath className="w-3.5 h-3.5 text-[#6b6b6b]" />
                  {fullProperty.bathrooms} BA
                </span>
              )}
              {hasSqft && (
                <span className="flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-[#6b6b6b]" />
                  {formatWholeNumber(fullProperty.sqft)} SF
                </span>
              )}
            </div>
          )}
        </div>
    </article>
  );

  if (disableLink) {
    return cardContent;
  }

  return <Link href={propertyHref}>{cardContent}</Link>;
}
