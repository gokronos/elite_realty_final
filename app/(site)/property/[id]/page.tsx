"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Bed, Bath, Maximize, ArrowLeft, Phone, Mail } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { urlFor } from "@/lib/sanity/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getPropertyById } from "@/lib/sanity/queries";
import type { Property } from "@/types";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) return;
      try {
        const data = await getPropertyById(propertyId);
        setProperty(data);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
        <h1 className="font-serif text-3xl text-white mb-4">Property not found</h1>
        <Button 
          variant="primary"
          onClick={() => router.push("/property")}
        >
          Back to Properties
        </Button>
      </div>
    );
  }

  // Get all images (featured + gallery)
  const allImages = [
    property.featuredImage,
    ...(property.gallery || [])
  ].filter(Boolean);

  const currentImage = allImages[currentImageIndex];
  const imageUrl = urlFor(currentImage)?.width(1400).height(900).url();

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
      {/* Header with back button */}
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

      {/* Image Carousel Section */}
      <section className="px-4 mb-12">
        <div className="container mx-auto">
          <div className="relative aspect-video bg-[#1a1a1a] rounded-lg overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={currentImage?.alt || property.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#2d2d2d]">
                <span className="text-[#6b6b6b]">No image</span>
              </div>
            )}

            {/* Navigation Arrows */}
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

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-black/70 text-white text-sm rounded-full">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Indicators */}
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

      {/* Property Details Section */}
      <section className="px-4 pb-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-8">
                <Badge status={property.status} className="mb-4" />
                
                <h1 className="font-serif text-4xl lg:text-5xl text-white mb-4">
                  {property.title}
                </h1>

                <p className="font-sans text-sm text-[#a0a0a0] uppercase tracking-widest mb-6">
                  {property.location.neighborhood && `${property.location.neighborhood}, `}
                  {property.location.city}, {property.location.state}
                </p>

                <p className="font-sans text-3xl lg:text-4xl text-white font-semibold mb-4">
                  {formatPrice(property.price)}
                  {property.priceType === "rent" && (
                    <span className="text-[#a0a0a0] text-lg ml-2"> /month</span>
                  )}
                </p>
              </div>

              {/* Property Specs */}
              <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg p-8 mb-8">
                <h3 className="font-serif text-2xl text-white mb-6">Property Features</h3>
                
                <div className="grid grid-cols-3 gap-6">
                  {property.bedrooms !== undefined && (
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Bed className="w-5 h-5 text-[#d4af37]" />
                        <span className="text-[#a0a0a0]">Bedrooms</span>
                      </div>
                      <p className="text-white text-2xl font-semibold">{property.bedrooms}</p>
                    </div>
                  )}
                  
                  {property.bathrooms !== undefined && (
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Bath className="w-5 h-5 text-[#d4af37]" />
                        <span className="text-[#a0a0a0]">Bathrooms</span>
                      </div>
                      <p className="text-white text-2xl font-semibold">{property.bathrooms}</p>
                    </div>
                  )}
                  
                  {property.sqft && (
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Maximize className="w-5 h-5 text-[#d4af37]" />
                        <span className="text-[#a0a0a0]">Square Feet</span>
                      </div>
                      <p className="text-white text-2xl font-semibold">{property.sqft.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Other Details */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {property.propertyType && (
                  <div>
                    <p className="text-[#a0a0a0] text-sm mb-2">Property Type</p>
                    <p className="text-white text-lg font-semibold capitalize">
                      {property.propertyType}
                    </p>
                  </div>
                )}
                
                {property.yearTransacted && (
                  <div>
                    <p className="text-[#a0a0a0] text-sm mb-2">Year</p>
                    <p className="text-white text-lg font-semibold">{property.yearTransacted}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <div className="mb-8">
                  <h3 className="font-serif text-2xl text-white mb-4">Description</h3>
                  <div className="font-sans text-[#a0a0a0] leading-relaxed prose prose-invert">
                    <PortableText value={property.description} />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Contact & Links */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Contact Card */}
                <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg p-8">
                  <h3 className="font-serif text-xl text-white mb-6">Interested?</h3>
                  
                  <Link href="/contact">
                    <Button 
                      variant="primary"
                      className="w-full mb-4"
                    >
                      Contact Alexandra
                    </Button>
                  </Link>

                  {/* Phone & Email */}
                  <div className="space-y-4 pt-6 border-t border-[#2d2d2d]">
                    <a
                      href="tel:+17871234567"
                      className="flex items-center gap-3 text-[#d4af37] hover:text-white transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span>+1 (787) 123-4567</span>
                    </a>
                    
                    <a
                      href="mailto:alexandra@eliterealty.com"
                      className="flex items-center gap-3 text-[#d4af37] hover:text-white transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span>alexandra@eliterealty.com</span>
                    </a>
                  </div>
                </div>

                {/* External Listing */}
                {property.externalUrl && (
                  <a
                    href={property.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button 
                      variant="secondary"
                      className="w-full"
                    >
                      View On Listing Site
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Properties Section */}
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
