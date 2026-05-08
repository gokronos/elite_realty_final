import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateAboutPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About Alexandra Lugo | Elite Realty",
  description:
    "Meet Alexandra Lugo, luxury real estate broker (PR Lic. C-19793 | FL 3507350) specializing in premium properties in Puerto Rico and Miami. Over 10 years of experience and $100M+ in transactions.",
  keywords: [
    "Alexandra Lugo real estate broker",
    "elite realty Puerto Rico",
    "luxury broker San Juan",
    "PR license C-19793",
    "corredora bienes raíces lujo",
  ],
  alternates: {
    canonical: "https://eliterealtypr.com/about",
  },
  openGraph: {
    title: "About Alexandra Lugo | Elite Realty",
    description:
      "Luxury real estate broker with 10+ years experience in Puerto Rico and Miami. PR Lic. C-19793 | FL 3507350.",
    url: "https://eliterealtypr.com/about",
  },
};

const stats = [
  { value: "10+", label: "Years of Experience" },
  { value: "96+", label: "Properties Closed" },
  { value: "2", label: "Markets: PR & FL" },
  { value: "$100M+", label: "In Transactions" },
];

const values = [
  {
    title: "Discretion",
    description:
      "High-net-worth clients trust Alexandra with their most sensitive transactions. Confidentiality is not a policy—it's a principle.",
  },
  {
    title: "Market Expertise",
    description:
      "Intimate knowledge of Condado, Dorado, Brickell, and beyond. Every neighborhood has a pulse—Alexandra knows it intimately.",
  },
  {
    title: "Personalized Service",
    description:
      "No two clients are alike. Alexandra takes the time to understand your lifestyle, goals, and vision before recommending a single property.",
  },
  {
    title: "Results-Driven",
    description:
      "From strategic pricing to skilled negotiation, every step is designed to achieve the best possible outcome for her clients.",
  },
];

export default function AboutPage() {
  const schemaData = generateAboutPageSchema();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <JsonLd data={schemaData} />

      {/* ── Hero ── */}
      <section className="pt-16 pb-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Alexandra Photo - Static Image */}
            <div className="aspect-[3/4] bg-[#1a1a1a] border border-[#2d2d2d] relative overflow-hidden">
              <Image
                src="/images/alexandra-2026.jpg"
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
                  allows her to provide an unparalleled level of service. Alexandra
                  is known for her calm approach, sharp instincts, and ability to
                  navigate even the most complex transactions with grace.
                </p>
                <p>
                  Whether you&apos;re seeking a beachfront condo in Condado, a
                  family estate in Dorado, or a sophisticated residence in Brickell,
                  Alexandra brings the expertise and discretion you deserve. Her
                  bilingual fluency in English and Spanish allows her to connect
                  authentically with a diverse clientele across both markets.
                </p>
                <p>
                  Beyond transactions, Alexandra sees herself as a trusted advisor—
                  someone clients return to not just once, but for every chapter of
                  their lives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 px-4 bg-[#1a1a1a] border-y border-[#2d2d2d]">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-4xl md:text-5xl text-[#d4af37] mb-2">
                  {stat.value}
                </p>
                <p className="text-[#a0a0a0] text-sm uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section className="py-24 px-4 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#d4af37] mb-4">
            Philosophy
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-8">
            Real Estate Is Personal
          </h2>
          <p className="text-[#a0a0a0] text-lg leading-relaxed mb-6">
            Alexandra believes real estate is never just a transaction.
            It is timing, trust, negotiation, intuition, and understanding how people truly want to live.
          </p>
          <p className="text-[#a0a0a0] text-lg leading-relaxed mb-6">
            Her approach is rooted in discretion, strategy, and long-term relationships — guiding clients through every stage of the process with clarity and intention.
          </p>
          <p className="text-[#a0a0a0] text-lg leading-relaxed">
            Whether buying, selling, or investing, the goal remains the same: to create an experience that feels seamless, thoughtful, and deeply personalized.
          </p>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="py-24 px-4 bg-[#1a1a1a]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-[#d4af37] mb-4">
              What Sets Her Apart
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
              The Alexandra Difference
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="p-8 bg-[#0a0a0a] border border-[#2d2d2d] hover:border-[#d4af37] transition-colors duration-300"
              >
                <div className="w-8 h-0.5 bg-[#d4af37] mb-4" />
                <h3 className="font-serif text-xl text-white mb-3">{v.title}</h3>
                <p className="text-[#a0a0a0] leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Markets ── */}
      <section className="py-24 px-4 bg-[#0a0a0a]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-[#d4af37] mb-4">
              Coverage
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              Markets Served
            </h2>
            <p className="text-[#a0a0a0] max-w-2xl mx-auto">
              Specializing in luxury properties across two of the most desirable
              markets in the Caribbean and South Florida
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-[#1a1a1a] border border-[#2d2d2d]">
              <div className="w-8 h-0.5 bg-[#d4af37] mb-6" />
              <h3 className="font-serif text-2xl text-white mb-2">Puerto Rico</h3>
              <p className="text-[#a0a0a0] text-sm mb-6">
                From the sophisticated streets of Condado to the exclusive golf
                communities of Dorado, Alexandra is your guide to island luxury.
              </p>
              <ul className="space-y-2 text-[#a0a0a0]">
                {["Condado", "Dorado", "Guaynabo", "Miramar", "Ocean Park", "Hato Rey", "Santurce"].map((loc) => (
                  <li key={loc} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#d4af37]" />
                    {loc}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 bg-[#1a1a1a] border border-[#2d2d2d]">
              <div className="w-8 h-0.5 bg-[#d4af37] mb-6" />
              <h3 className="font-serif text-2xl text-white mb-2">Florida</h3>
              <p className="text-[#a0a0a0] text-sm mb-6">
                Navigating Miami&apos;s competitive luxury market with the same
                precision and care she brings to every client relationship.
              </p>
              <ul className="space-y-2 text-[#a0a0a0]">
                {["Coral Gables", "Brickell", "Miami Beach", "Key Biscayne", "Coconut Grove"].map((loc) => (
                  <li key={loc} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#d4af37]" />
                    {loc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 bg-[#1a1a1a] border-t border-[#2d2d2d]">
        <div className="container mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
            Let&apos;s Work Together
          </h2>
          <p className="text-[#a0a0a0] text-lg mb-8 max-w-2xl mx-auto">
            Ready to find your perfect property? Get in touch to discuss your
            real estate goals. Alexandra responds personally to every inquiry.
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
