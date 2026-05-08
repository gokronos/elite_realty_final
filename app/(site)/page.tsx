import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { PropertyCard } from "@/components/property/PropertyCard";
import { InformativePropertyCarousel } from "@/components/property/InformativePropertyCarousel";
import { LocationCard } from "@/components/ui/LocationCard";
import { HeroBackground, slides, HERO_FADE_DURATION } from "@/components/hero/HeroBackground";
import { HeroContent } from "@/components/hero/HeroContent";
import {
  getPropertiesForSale,
  getSoldProperties,
  getPropertiesForRent,
  getRentedProperties,
  getAllBlogPosts,
} from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { formatDate } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateHomePageSchema } from "@/lib/schema";

const locations = [
  { name: "Condado", slug: "condado", image: "/images/locations/condado.png" },
  { name: "Dorado", slug: "dorado", image: "/images/locations/dorado.png" },
  { name: "Guaynabo", slug: "guaynabo", image: "/images/locations/guaynabo.jpg" },
  { name: "Miramar", slug: "miramar", image: "/images/locations/miramar.png" },
  { name: "Ocean Park", slug: "ocean-park", image: "/images/locations/ocean-park.png" },
  { name: "Hato Rey", slug: "hato-rey", image: "/images/locations/hato-rey.png" },
];

export default async function HomePage() {
  const [propertiesForSale, propertiesForRent, soldProperties, rentedProperties, blogPosts] = await Promise.all([
    getPropertiesForSale(),
    getPropertiesForRent(),
    getSoldProperties(),
    getRentedProperties(),
    getAllBlogPosts(),
  ]);
  const schemaData = generateHomePageSchema();

  return (
    <>
      <JsonLd data={schemaData} />

      {/* ========================================
          SECTION 1: HERO (100vh)
          ======================================== */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background Video/Image */}
        <HeroBackground />

        {/* Content overlay */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen gap-6 px-6 text-center pointer-events-none">
          {/* Animated Slide Text */}
          <div className="pointer-events-auto">
            <HeroContent slides={slides} fadeDuration={HERO_FADE_DURATION} />
          </div>

          {/* Buttons always at the bottom */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
            <Link href="/property">
              <Button variant="secondary" size="lg">
                View Properties
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 2: MEET ALEXANDRA
          ======================================== */}
      <section className="py-20 lg:py-24 px-4 bg-[#0a0a0a]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image - Left */}
            <div className="aspect-[3/4] relative overflow-hidden">
              <Image
                src="/images/alexandra-2026.jpg"
                alt="Alexandra Lugo - Luxury Real Estate Broker"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Content - Right */}
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-2 tracking-wide">
                MEET ALEXANDRA
              </h2>
              <div className="w-16 h-0.5 bg-[#d4af37] mb-8" />
              <p className="text-[#a0a0a0] text-lg leading-relaxed mb-8">
                With over a decade of experience in the Puerto Rico and Miami
                luxury markets, Alexandra Lugo brings unparalleled expertise
                and a personalized approach to every client relationship.
                Her deep knowledge of waterfront properties, exclusive communities,
                and Act 60 opportunities makes her the trusted advisor for
                discerning clients seeking exceptional real estate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/about">
                  <Button variant="secondary">Learn More</Button>
                </Link>
                <Link href="/property?status=sold">
                  <Button variant="secondary">Recent Sales</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 3: JOURNAL
          ======================================== */}
      <section className="py-20 lg:py-24 px-4 bg-[#1a1a1a]">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-wide">
              JOURNAL
            </h2>
          </div>

          {/* Blog Posts Grid */}
          {blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {blogPosts.slice(0, 3).map((post) => {
                const imageUrl = post.featuredImage
                  ? urlFor(post.featuredImage)?.width(600).height(450).url()
                  : null;

                return (
                  <article
                    key={post._id}
                    className="group bg-[#0a0a0a] border border-[#2d2d2d] hover:border-[#8a8a8a] transition-colors overflow-hidden"
                  >
                    <Link href={`/journal/${post.slug.current}`}>
                      {/* Image - Vertical */}
                      <div className="aspect-[4/5] bg-[#2d2d2d] relative overflow-hidden">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={post.featuredImage?.alt || post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <p className="text-[#6b6b6b]">No image</p>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <p className="text-xs uppercase tracking-[0.15em] text-[#d4af37] mb-3">
                          {formatDate(post.publishedAt)}
                          {post.author?.name && ` · ${post.author.name}`}
                        </p>
                        <h3 className="font-serif text-lg sm:text-xl text-white group-hover:text-[#d4af37] transition-colors mb-3">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-[#a0a0a0] text-sm line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[#a0a0a0] text-lg mb-4">No articles yet.</p>
              <p className="text-[#6b6b6b]">Check back soon for insights on luxury real estate.</p>
            </div>
          )}

          {/* View All Button */}
          {blogPosts.length > 3 && (
            <div className="text-center mt-12">
              <Link href="/journal">
                <Button variant="secondary">View All Articles</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ========================================
          SECTION 4: FOR SALE
          ======================================== */}
      <section className="py-20 lg:py-24 px-4 bg-[#0a0a0a]">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-wide">
              FOR SALE
            </h2>
          </div>

          {/* Property Grid */}
          {propertiesForSale.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {propertiesForSale.slice(0, 6).map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 max-w-2xl mx-auto">
              <p className="text-[#a0a0a0] text-lg mb-6">
                New listings coming soon. Contact Alexandra for exclusive pre-market opportunities.
              </p>
              <Link href="/contact">
                <Button variant="primary">
                  Get Early Access
                </Button>
              </Link>
            </div>
          )}

          {/* View All Button */}
          {propertiesForSale.length > 6 && (
            <div className="text-center mt-12">
              <Link href="/property?status=active-sale">
                <Button variant="secondary">View All</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ========================================
          SECTION 5: FOR RENT
          ======================================== */}
      <section className="py-20 lg:py-24 px-4 bg-[#1a1a1a]">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-wide">
              FOR RENT
            </h2>
          </div>

          {/* Property Grid */}
          {propertiesForRent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {propertiesForRent.slice(0, 6).map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 max-w-2xl mx-auto">
              <p className="text-[#a0a0a0] text-lg mb-6">
                New rental listings coming soon. Contact Alexandra for exclusive rental opportunities.
              </p>
              <Link href="/contact">
                <Button variant="primary">
                  Inquire About Rentals
                </Button>
              </Link>
            </div>
          )}

          {/* View All Button */}
          {propertiesForRent.length > 6 && (
            <div className="text-center mt-12">
              <Link href="/property?status=active-rental">
                <Button variant="secondary">View All</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ========================================
          SECTION 6: SOLD (INFORMATIVE)
          ======================================== */}
      <section className="py-20 lg:py-24 px-4 bg-[#0a0a0a]">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-wide">
              SOLD
            </h2>
          </div>

          {/* Informative carousel */}
          {soldProperties.length > 0 ? (
            <InformativePropertyCarousel
              properties={soldProperties}
              ariaLabel="Sold properties carousel"
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-[#6b6b6b]">No sold properties to display.</p>
            </div>
          )}
        </div>
      </section>

      {/* ========================================
          SECTION 7: RENTED (INFORMATIVE)
          ======================================== */}
      <section className="py-20 lg:py-24 px-4 bg-[#1a1a1a]">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-wide">
              RENTED
            </h2>
          </div>

          {/* Informative carousel */}
          {rentedProperties.length > 0 ? (
            <InformativePropertyCarousel
              properties={rentedProperties}
              ariaLabel="Rented properties carousel"
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-[#6b6b6b]">No rented properties to display.</p>
            </div>
          )}
        </div>
      </section>

      {/* ========================================
          SECTION 8: LOCATIONS
          ======================================== */}
      <section className="bg-[#0a0a0a]">
        {/* Section Header */}
        <div className="py-12 lg:py-16 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-wide">
            LOCATIONS
          </h2>
        </div>

        {/* Location Grid - Edge to Edge */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <LocationCard
              key={location.slug}
              name={location.name}
              slug={location.slug}
              image={location.image}
            />
          ))}
        </div>
      </section>

      {/* ========================================
          SECTION 9: CONTACT CTA
          ======================================== */}
      <section className="py-20 lg:py-24 px-4 bg-[#1a1a1a]">
        <div className="container mx-auto text-center">
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-white mb-6 tracking-wide">
            LET&apos;S CONNECT
          </h2>
          <p className="text-[#a0a0a0] text-lg mb-4">
            Ready to find your dream property?
          </p>
          <p className="text-white text-xl mb-2">
            <a href="tel:+17873083982" className="hover:text-[#d4af37] transition-colors">
              (787) 308-3982
            </a>
          </p>
          <p className="text-[#a0a0a0] mb-8">
            <a href="mailto:info@eliterealtypr.com" className="hover:text-[#d4af37] transition-colors">
              info@eliterealtypr.com
            </a>
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Contact Alexandra
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
