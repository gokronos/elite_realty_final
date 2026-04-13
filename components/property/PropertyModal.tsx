"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, ExternalLink, Bed, Bath, Maximize, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { urlFor } from "@/lib/sanity/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Property } from "@/types";

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyModal({ property, isOpen, onClose }: PropertyModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentImageIndex(0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!property) return null;

  // Get all images (featured + gallery)
  const allImages = [
    property.featuredImage,
    ...(property.gallery || [])
  ].filter(Boolean);

  const currentImage = allImages[currentImageIndex];
  const imageUrl = urlFor(currentImage)?.width(1200).height(800).url();

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      handleNextImage(e as any);
    } else if (e.key === "ArrowLeft") {
      handlePrevImage(e as any);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/90 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-auto",
          "bg-[#0a0a0a] border border-[#2d2d2d]",
          "transform transition-all duration-300",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white hover:text-[#d4af37] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-full">
          {/* Image Section with Carousel */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-full bg-[#1a1a1a]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={currentImage?.alt || property.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#2d2d2d] flex items-center justify-center">
                <span className="text-[#6b6b6b]">No image</span>
              </div>
            )}

            {/* Navigation Arrows - Only show if multiple images */}
            {allImages.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/80 text-white transition-all rounded-full"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Next Button */}
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/50 hover:bg-black/80 text-white transition-all rounded-full"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-black/70 text-white text-sm rounded-full">
                  {currentImageIndex + 1} / {allImages.length}
                </div>

                {/* Thumbnail Indicators */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {allImages.map((image, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                        }}
                        className={cn(
                          "w-12 h-12 rounded-lg overflow-hidden transition-all border-2 flex-shrink-0",
                          idx === currentImageIndex
                            ? "border-[#d4af37] ring-2 ring-[#d4af37]"
                            : "border-[#2d2d2d] hover:border-[#4d4d4d]"
                        )}
                        aria-label={`Go to image ${idx + 1}`}
                      >
                        <Image
                          src={urlFor(image)?.width(80).height(80).url() || ""}
                          alt={image?.alt || `Image ${idx + 1}`}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Dot Indicators (backup if thumbnails don't load) */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        idx === currentImageIndex
                          ? "bg-[#d4af37] w-4"
                          : "bg-white/50 hover:bg-white/80"
                      )}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Content */}
          <div className="p-8 lg:p-12 flex flex-col">
            <Badge status={property.status} className="self-start mb-4" />

            <h2 className="font-serif text-3xl lg:text-4xl text-white mb-2">
              {property.title}
            </h2>

            <p className="font-sans text-sm text-[#a0a0a0] uppercase tracking-widest mb-6">
              {property.location.neighborhood && `${property.location.neighborhood}, `}
              {property.location.city}, {property.location.state}
            </p>

            <p className="font-sans text-2xl text-white mb-8">
              {formatPrice(property.price)}
              {property.priceType === "rent" && (
                <span className="text-[#a0a0a0] text-lg"> /month</span>
              )}
            </p>

            {/* Details */}
            <div className="flex gap-6 mb-8">
              {property.bedrooms !== undefined && (
                <div className="flex items-center gap-2 text-[#a0a0a0] font-sans">
                  <Bed className="w-5 h-5" />
                  <span>{property.bedrooms} beds</span>
                </div>
              )}
              {property.bathrooms !== undefined && (
                <div className="flex items-center gap-2 text-[#a0a0a0] font-sans">
                  <Bath className="w-5 h-5" />
                  <span>{property.bathrooms} baths</span>
                </div>
              )}
              {property.sqft && (
                <div className="flex items-center gap-2 text-[#a0a0a0] font-sans">
                  <Maximize className="w-5 h-5" />
                  <span>{property.sqft.toLocaleString()} sqft</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-auto">
              <Button 
                variant="primary"
                onClick={() => {
                  const propertyPath = property.slug?.current || property._id;
                  router.push(`/property/${propertyPath}`);
                  onClose();
                }}
              >
                More Information
              </Button>
              {property.externalUrl && (
                <a
                  href={property.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Listing
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
