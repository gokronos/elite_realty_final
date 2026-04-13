import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateAboutPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About Alexandra Lugo | Elite Realty",
  description:
    "Meet Alexandra Lugo, luxury real estate broker specializing in Puerto Rico and Miami properties.",
};

export default function AboutPage() {
  const schemaData = generateAboutPageSchema();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <JsonLd data={schemaData} />
      {/* Hero */}
      <section className="pt-16 pb-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Alexandra Photo - Static Image */}
            <div className="aspect-[3/4] bg-[#1a1a1a] border border-[#2d2d2d] relative overflow-hidden">
              <Image
                src="/images/alexandra.png"
                alt="Alexandra Lugo - Luxury Real Estate Broker"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Content */}
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#d4af37] mb-4">
                About
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                Alexandra Lugo
              </h1>
              <div className="space-y-6 text-[#a0a0a0] text-lg leading-relaxed">
                <p>
                  With over a decade of experience in luxury real estate, Alexandra
                  Lugo has established herself as one of the premier brokers serving
                  the Puerto Rico and South Florida markets.
                </p>
                <p>
                  Her deep understanding of the unique needs of high-net-worth
                  clients, combined with her intimate knowledge of both markets,
                  allows her to provide an unparalleled level of service.
                </p>
                <p>
                  Whether you&apos;re seeking a beachfront condo in Condado, a
                  family estate in Dorado, or a sophisticated residence in Brickell,
                  Alexandra brings the expertise and discretion you deserve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Markets */}
      <section className="py-24 px-4 bg-[#1a1a1a]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              Markets Served
            </h2>
            <p className="text-[#a0a0a0] max-w-2xl mx-auto">
              Specializing in luxury properties across two of the most desirable
              markets in the Caribbean and South Florida
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Puerto Rico */}
            <div className="p-8 bg-[#0a0a0a] border border-[#2d2d2d]">
              <h3 className="font-serif text-2xl text-white mb-4">Puerto Rico</h3>
              <ul className="space-y-2 text-[#a0a0a0]">
                <li>Condado</li>
                <li>Dorado</li>
                <li>Guaynabo</li>
                <li>Miramar</li>
                <li>Old San Juan</li>
              </ul>
            </div>

            {/* Florida */}
            <div className="p-8 bg-[#0a0a0a] border border-[#2d2d2d]">
              <h3 className="font-serif text-2xl text-white mb-4">Florida</h3>
              <ul className="space-y-2 text-[#a0a0a0]">
                <li>Coral Gables</li>
                <li>Brickell</li>
                <li>Miami Beach</li>
                <li>Key Biscayne</li>
                <li>Coconut Grove</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-[#0a0a0a]">
        <div className="container mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
            Let&apos;s Work Together
          </h2>
          <p className="text-[#a0a0a0] text-lg mb-8 max-w-2xl mx-auto">
            Ready to find your perfect property? Get in touch to discuss your
            real estate goals.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Contact Alexandra
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
