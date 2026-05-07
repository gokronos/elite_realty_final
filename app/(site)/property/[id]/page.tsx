import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { PropertyDetailClient } from "@/components/property/PropertyDetailClient";
import { generatePropertyPageSchema } from "@/lib/schema";
import { getPropertyById, getPropertyBySlug, getPropertyPaths } from "@/lib/sanity/queries";
import { formatPrice, formatPropertyLocation } from "@/lib/utils";

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

async function resolveProperty(id: string) {
  const decodedId = decodeURIComponent(id);
  let property = await getPropertyBySlug(decodedId);

  if (!property) {
    property = await getPropertyById(decodedId);
  }

  return property;
}

export async function generateStaticParams() {
  const slugs = [...new Set(await getPropertyPaths())];
  return slugs.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await resolveProperty(id);
  const canonicalId = property?.slug?.current || decodeURIComponent(id);
  const canonicalUrl = `https://eliterealtypr.com/property/${encodeURIComponent(canonicalId)}`;

  if (!property) {
    return {
      title: "Property Not Found | Elite Realty",
      robots: {
        index: false,
        follow: false,
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }

  const locationLabel = formatPropertyLocation(property.location);
  const title = `${property.title} | Elite Realty`;
  const description = `${property.title}${locationLabel ? ` in ${locationLabel}` : ""}. ${formatPrice(property.price)}${property.priceType === "rent" ? " per month" : ""}. Explore this ${property.propertyType || "luxury"} property with Elite Realty.`;
  const ogImage = property.featuredImage?.asset?.url || "https://eliterealtypr.com/images/alexandra2.png";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 675,
          alt: property.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = await resolveProperty(id);

  if (!property) {
    notFound();
  }

  const schemaData = generatePropertyPageSchema(property);

  return (
    <>
      <JsonLd data={schemaData} />
      <PropertyDetailClient property={property} />
    </>
  );
}
