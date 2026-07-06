import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Elite Realty | Site in Progress",
  description:
    "Elite Realty is preparing an updated luxury real estate experience.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnderConstructionPage() {
  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <section className="relative flex min-h-screen items-center overflow-hidden px-6 py-12">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-beach.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-35"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
          <div className="mx-auto mb-10 h-20 w-64">
            <Image
              src="/images/logoblanco2.png"
              alt="Elite Realty"
              width={320}
              height={100}
              priority
              className="h-full w-full object-contain"
            />
          </div>

          <p className="mb-4 font-sans text-xs uppercase tracking-[0.35em] text-[#d4af37]">
            Puerto Rico & Florida
          </p>

          <h1 className="mb-6 font-serif text-4xl leading-tight text-white md:text-6xl">
            Site in Progress
          </h1>

          <p className="mx-auto mb-10 max-w-2xl font-sans text-base leading-7 text-[#d8d8d8] md:text-lg">
            We are refining the Elite Realty property experience. For private
            showings, active listings, or market guidance, contact Alexandra
            Lugo directly.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="tel:+17873083982"
              className="inline-flex min-h-12 items-center gap-3 border border-[#d4af37] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#d4af37] transition-colors hover:bg-[#d4af37] hover:text-black"
            >
              <Phone className="h-4 w-4" />
              (787) 308-3982
            </Link>

            <Link
              href="mailto:info@eliterealtypr.com"
              className="inline-flex min-h-12 items-center gap-3 border border-white/25 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-white hover:bg-white hover:text-black"
            >
              <Mail className="h-4 w-4" />
              Email
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
