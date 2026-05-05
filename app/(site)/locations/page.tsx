import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LocationCard } from "@/components/ui/LocationCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateLocationsPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Locations | Elite Realty",
  description:
    "Explore luxury locations in Puerto Rico and Miami served by Elite Realty.",
};

const locations = {
  "Puerto Rico": [
    {
      name: "Condado",
      slug: "condado",
      image: "/images/locations/condado.jpg",
      description:
        "San Juan's most prestigious beachfront neighborhood, known for luxury high-rises and vibrant nightlife.",
    },
    {
      name: "Dorado",
      slug: "dorado",
      image: "/images/locations/dorado.jpg",
      description:
        "Home to world-class golf courses and exclusive gated communities along pristine beaches.",
    },
    {
      name: "Guaynabo",
      slug: "guaynabo",
      image: "/images/locations/guaynabo.jpg",
      description:
        "Upscale residential area with excellent schools and family-friendly communities.",
    },
    {
      name: "Miramar",
      slug: "miramar",
      image: "/images/locations/miramar.jpg",
      description:
        "Historic district with stunning architecture and waterfront properties.",
    },
    {
      name: "Hato Rey",
      slug: "hato-rey",
      image: "/images/locations/hato-rey.jpg",
      description:
        "Puerto Rico's financial district with modern high-rises and the Golden Mile.",
    },
    {
      name: "Santurce",
      slug: "santurce",
      image: "/images/locations/santurce.jpg",
      description:
        "Vibrant arts district with eclectic culture and urban renaissance.",
    },
    {
      name: "Ocean Park",
      slug: "ocean-park",
      image: "/images/locations/ocean-park.jpg",
      description:
        "Laid-back beachfront community with boutique charm near Condado.",
    },
  ],
  Florida: [
    {
      name: "Coral Gables",
      slug: "coral-gables",
      image: "/images/locations/coral-gables.jpg",
      description:
        "The City Beautiful, featuring Mediterranean-style estates and tree-lined boulevards.",
    },
    {
      name: "Brickell",
      slug: "brickell",
      image: "/images/locations/brickell.jpg",
      description:
        "Miami's financial district with sleek high-rise condos and urban sophistication.",
    },
    {
      name: "Miami Beach",
      slug: "miami-beach",
      image: "/images/locations/miami-beach.jpg",
      description:
        "Iconic oceanfront living with Art Deco charm and world-famous beaches.",
    },
    {
      name: "Edgewater",
      slug: "edgewater",
      image: "/images/locations/edgewater.jpg",
      description:
        "Trendy waterfront neighborhood along Biscayne Bay, known for luxury high-rises and vibrant arts culture.",
    },
  ],
};

export default function LocationsPage() {
  const schemaData = generateLocationsPageSchema();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <JsonLd data={schemaData} />
      
      {/* Header */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-wide uppercase">
            Locations
          </h1>
          <p className="text-[#a0a0a0] text-lg max-w-2xl mx-auto">
            Discover the exclusive communities where we help clients find their
            perfect home
          </p>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="pb-24 px-4">
        <div className="container mx-auto">
          {Object.entries(locations).map(([region, areas]) => (
            <div key={region} className="mb-20 last:mb-0">
              <h2 className="font-serif text-2xl md:text-3xl text-white mb-10 pb-4 border-b border-[#2d2d2d] uppercase tracking-wider">
                {region}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {areas.map((area) => (
                  <LocationCard
                    key={area.slug}
                    name={area.name}
                    slug={area.slug}
                    image={area.image}
                    description={area.description}
                    variant="detailed"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-[#1a1a1a] border-t border-[#2d2d2d]">
        <div className="container mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-6 uppercase tracking-wide">
            Find Your Location
          </h2>
          <p className="text-[#a0a0a0] text-lg mb-8 max-w-2xl mx-auto">
            Let Alexandra help you find the perfect location for your lifestyle
            and investment goals.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Schedule a Consultation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
