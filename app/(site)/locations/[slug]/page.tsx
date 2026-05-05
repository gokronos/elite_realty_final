import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PropertyCard } from "@/components/property/PropertyCard";
import { getAllProperties } from "@/lib/sanity/queries";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateLocationPageSchema } from "@/lib/schema";

const locationData: Record<string, { name: string; description: string; neighborhoods: string[]; city: string; state: string }> = {
  "condado": {
    name: "Condado",
    description: "San Juan's most prestigious beachfront neighborhood, known for luxury high-rises and vibrant nightlife.",
    neighborhoods: ["Condado"],
    city: "San Juan",
    state: "PR",
  },
  "dorado": {
    name: "Dorado",
    description: "Home to world-class golf courses and exclusive gated communities along pristine beaches.",
    neighborhoods: ["Dorado", "Dorado Beach East", "Plantation Village", "Sierra del Rio"],
    city: "Dorado",
    state: "PR",
  },
  "guaynabo": {
    name: "Guaynabo",
    description: "Upscale residential area with excellent schools and family-friendly communities.",
    neighborhoods: ["Guaynabo", "Torrimar", "Garden Hills", "San Patricio"],
    city: "Guaynabo",
    state: "PR",
  },
  "miramar": {
    name: "Miramar",
    description: "Historic district with stunning architecture and waterfront properties.",
    neighborhoods: ["Miramar"],
    city: "San Juan",
    state: "PR",
  },
  "hato-rey": {
    name: "Hato Rey",
    description: "Puerto Rico's financial district with modern high-rises and the Golden Mile.",
    neighborhoods: ["Hato Rey", "Ciudadela"],
    city: "San Juan",
    state: "PR",
  },
  "santurce": {
    name: "Santurce",
    description: "Vibrant arts district with eclectic culture and urban renaissance.",
    neighborhoods: ["Santurce"],
    city: "San Juan",
    state: "PR",
  },
  "ocean-park": {
    name: "Ocean Park",
    description: "Laid-back beachfront community with boutique charm near Condado.",
    neighborhoods: ["Ocean Park"],
    city: "San Juan",
    state: "PR",
  },
  "coral-gables": {
    name: "Coral Gables",
    description: "The City Beautiful, featuring Mediterranean-style estates and tree-lined boulevards.",
    neighborhoods: ["Coral Gables"],
    city: "Miami",
    state: "FL",
  },
  "brickell": {
    name: "Brickell",
    description: "Miami's financial district with sleek high-rise condos and urban sophistication.",
    neighborhoods: ["Brickell"],
    city: "Miami",
    state: "FL",
  },
  "miami-beach": {
    name: "Miami Beach",
    description: "Iconic oceanfront living with Art Deco charm and world-famous beaches.",
    neighborhoods: ["Miami Beach"],
    city: "Miami Beach",
    state: "FL",
  },
  "edgewater": {
    name: "Edgewater",
    description: "Trendy waterfront neighborhood along Biscayne Bay, known for luxury high-rises and vibrant arts culture.",
    neighborhoods: ["Edgewater"],
    city: "Miami",
    state: "FL",
  },
};

interface LocationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(locationData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = locationData[slug];

  if (!data) {
    return { title: "Location Not Found | Elite Realty" };
  }

  return {
    title: `${data.name} Properties | Elite Realty`,
    description: data.description,
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const data = locationData[slug];

  if (!data) {
    notFound();
  }

  const allProperties = await getAllProperties();
  const properties = allProperties.filter(
    (p) => p.location?.neighborhood && data.neighborhoods.includes(p.location.neighborhood)
  );

  const schemaData = generateLocationPageSchema(
    data.name,
    data.description,
    data.city,
    data.state,
    slug
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <JsonLd data={schemaData} />
      <div className="pt-28 px-4">
        <div className="container mx-auto">
          <Link
            href="/locations"
            className="inline-flex items-center text-[#a0a0a0] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Locations
          </Link>
        </div>
      </div>

      <section className="pt-8 pb-8 px-4">
        <div className="container mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 tracking-wide">
            {data.name}
          </h1>
          <p className="text-[#a0a0a0] text-lg max-w-2xl">
            {data.description}
          </p>
          <p className="text-[#d4af37] mt-4">
            {properties.length} {properties.length === 1 ? "property" : "properties"} available
          </p>
        </div>
      </section>

      <section className="pb-24 px-4">
        <div className="container mx-auto">
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[#a0a0a0] text-lg mb-4">
                No properties currently available in {data.name}.
              </p>
              <p className="text-[#6b6b6b]">
                Check back soon or contact Alexandra for off-market opportunities.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
