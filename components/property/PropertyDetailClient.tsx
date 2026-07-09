"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Maximize,
  ArrowLeft,
  Phone,
  Mail,
} from "lucide-react";
import { PortableText } from "@portabletext/react";
import {
  cn,
  formatPrice,
  formatPropertyLocationFromProperty,
  formatPropertyTitle,
  formatWholeNumber,
  getPropertySquareFeet,
  isForRentStatus,
  isMonthlyRentPrice,
} from "@/lib/utils";
import { urlFor } from "@/lib/sanity/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PropertyCard } from "@/components/property/PropertyCard";
import type { Property } from "@/types";

interface PropertyDetailClientProps {
  property: Property;
  relatedProperties?: Property[];
}

export function PropertyDetailClient({
  property,
  relatedProperties = [],
}: PropertyDetailClientProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = [property.featuredImage, ...(property.gallery || [])].filter(Boolean);
  const currentImage = allImages[currentImageIndex];
  const imageUrl = urlFor(currentImage)?.width(1400).height(900).url();
  const displayTitle = formatPropertyTitle(property.title);
  const squareFeet = getPropertySquareFeet(property);
  const isHistoricalProperty = property.status === "sold" || property.status === "rented";
  const showBedrooms =
    property.propertyType !== "commercial" &&
    property.propertyType !== "land" &&
    property.bedrooms !== undefined;
  const showBathrooms =
    property.propertyType !== "land" && property.bathrooms !== undefined;
  const showSquareFeet = property.propertyType !== "land" && Boolean(squareFeet);
  const showFeatureSummary = !isHistoricalProperty && (showBedrooms || showBathrooms || showSquareFeet);
  const externalListingUrl = property.externalListingUrl ?? property.externalUrl;
  const addressParts = [
    property.streetAddress ?? property.location?.address,
    property.city ?? property.location?.city,
    property.state ?? property.location?.state,
    property.zipCode,
  ].filter(Boolean);
  const detailItems = [
    property.propertyType
      ? { label: "Property Type", value: property.propertyType }
      : null,
    property.communityOrBuilding
      ? { label: "Community / Building", value: property.communityOrBuilding }
      : null,
    property.market ?? property.location?.neighborhood
      ? { label: "Market", value: property.market ?? property.location?.neighborhood }
      : null,
    addressParts.length > 0
      ? { label: "Address", value: addressParts.join(", ") }
      : null,
    property.propertyType !== "land" && property.halfBathrooms !== undefined
      ? { label: "Half Bathrooms", value: property.halfBathrooms }
      : null,
    property.lotSize ? { label: "Lot Size", value: property.lotSize } : null,
    property.yearBuilt ? { label: "Year Built", value: property.yearBuilt } : null,
    property.yearTransacted
      ? { label: "Year", value: property.yearTransacted }
      : null,
  ].filter(Boolean) as { label: string; value: string | number }[];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") handleNextImage();
    else if (e.key === "ArrowLeft") handlePrevImage();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="pt-24 px-4 pb-8">
        <div className="container mx-auto">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[#d4af37] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>

      <section className="px-4 mb-12">
        <div className="container mx-auto">
          <div className="relative aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={currentImage?.alt || displayTitle}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#2d2d2d]">
                <span className="text-[#6b6b6b]">No image</span>
              </div>
            )}

            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  onKeyDown={handleKeyDown}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/80 text-white transition-all rounded-full"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNextImage}
                  onKeyDown={handleKeyDown}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/80 text-white transition-all rounded-full"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-black/70 text-white text-sm rounded-full">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
              {allImages.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={cn(
                    "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all border-2",
                    idx === currentImageIndex
                      ? "border-[#d4af37]"
                      : "border-[#2d2d2d] hover:border-[#4d4d4d]"
                  )}
                >
                  <Image
                    src={urlFor(image)?.width(100).height(100).url() || ""}
                    alt={image?.alt || `Image ${idx + 1}`}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <Badge status={property.status} className="mb-4" />

                <h1 className="font-serif text-4xl lg:text-5xl text-white mb-4">{displayTitle}</h1>

                <p className="font-sans text-sm text-[#a0a0a0] uppercase tracking-widest mb-6">
                  {formatPropertyLocationFromProperty(property)}
                </p>

                {!isHistoricalProperty && (
                  <p className="font-sans text-3xl lg:text-4xl text-white font-semibold mb-4">
                    {formatPrice(property.price)}
                    {(isForRentStatus(property.status) || isMonthlyRentPrice(property.priceType)) && (
                      <span className="text-[#a0a0a0] text-lg ml-2"> /month</span>
                    )}
                  </p>
                )}
              </div>

              {showFeatureSummary && (
                <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg p-8 mb-8">
                  <h3 className="font-serif text-2xl text-white mb-6">Property Features</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {showBedrooms && (
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Bed className="w-5 h-5 text-[#d4af37]" />
                          <span className="text-[#a0a0a0]">Bedrooms</span>
                        </div>
                        <p className="text-white text-2xl font-semibold">{property.bedrooms}</p>
                      </div>
                    )}

                    {showBathrooms && (
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Bath className="w-5 h-5 text-[#d4af37]" />
                          <span className="text-[#a0a0a0]">Bathrooms</span>
                        </div>
                        <p className="text-white text-2xl font-semibold">{property.bathrooms}</p>
                      </div>
                    )}

                    {showSquareFeet && (
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Maximize className="w-5 h-5 text-[#d4af37]" />
                          <span className="text-[#a0a0a0]">Square Feet</span>
                        </div>
                        <p className="text-white text-2xl font-semibold">{formatWholeNumber(squareFeet)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {detailItems.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {detailItems.map((item) => (
                    <div key={item.label}>
                      <p className="text-[#a0a0a0] text-sm mb-2">{item.label}</p>
                      <p className="text-white text-lg font-semibold capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {property.shortDescription && (
                <div className="mb-8">
                  <p className="font-sans text-[#cfcfcf] text-lg leading-relaxed">
                    {property.shortDescription}
                  </p>
                </div>
              )}

              {property.description && (
                <div className="mb-8">
                  <h3 className="font-serif text-2xl text-white mb-4">Description</h3>
                  <div className="font-sans text-[#a0a0a0] leading-relaxed prose prose-invert">
                    <PortableText value={property.description} />
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg p-8">
                  <h3 className="font-serif text-xl text-white mb-6">Interested?</h3>

                  <Link href="/contact">
                    <Button variant="primary" className="w-full mb-4">
                      Contact Alexandra
                    </Button>
                  </Link>

                  <div className="space-y-4 pt-6 border-t border-[#2d2d2d]">
                    <a
                      href="tel:+17873083982"
                      className="flex items-center gap-3 text-[#d4af37] hover:text-white transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span>+1 (787) 308-3982</span>
                    </a>

                    <a
                      href="mailto:info@eliterealtypr.com"
                      className="flex items-center gap-3 text-[#d4af37] hover:text-white transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span>info@eliterealtypr.com</span>
                    </a>
                  </div>
                </div>

                {externalListingUrl && (
                  <a href={externalListingUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" className="w-full">
                      View On Listing Site
                    </Button>
                  </a>
                )}

                {property.virtualTourUrl && (
                  <a href={property.virtualTourUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" className="w-full">
                      Virtual Tour
                    </Button>
                  </a>
                )}

                {property.videoUrl && (
                  <a href={property.videoUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" className="w-full">
                      Video
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProperties.length > 0 && (
        <section className="px-4 py-16 border-t border-[#2d2d2d] bg-[#111111]">
          <div className="container mx-auto">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">
                  Related Properties
                </h2>
                <p className="text-[#a0a0a0]">
                  Explore similar active listings in Puerto Rico and Miami
                </p>
              </div>

              <Link href="/property">
                <Button variant="secondary">View All Properties</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProperties.map((relatedProperty) => (
                <PropertyCard
                  key={relatedProperty._id}
                  property={relatedProperty}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 py-16 border-t border-[#2d2d2d]">
        <div className="container mx-auto text-center">
          <h2 className="font-serif text-3xl text-white mb-4">Back to Properties</h2>
          <p className="text-[#a0a0a0] mb-8">View more luxury properties</p>
          <Link href="/property">
            <Button variant="primary">Browse All Properties</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
