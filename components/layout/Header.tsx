"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { MobileMenu } from "./MobileMenu";

export type DropdownChild = { href: string; label: string };
export type DropdownItem = {
  label: string;
  href: string | null;
  children: DropdownChild[] | null;
};
export type NavLink = {
  href: string;
  label: string;
  dropdown?: DropdownItem[];
};

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  {
    href: "/property",
    label: "Properties",
    dropdown: [
      {
        label: "Active",
        href: null,
        children: [
          { href: "/property?status=active-sale", label: "For Sale" },
          { href: "/property?status=active-rental", label: "For Rent" },
        ],
      },
      { label: "Sold",   href: "/property?status=sold",   children: null },
      { label: "Leased", href: "/property?status=rented", children: null },
    ],
  },
  {
    href: "/locations",
    label: "Markets",
    dropdown: [
      {
        label: "Puerto Rico",
        href: null,
        children: [
          { href: "/locations/condado", label: "Condado" },
          { href: "/locations/dorado", label: "Dorado" },
          { href: "/locations/guaynabo", label: "Guaynabo" },
          { href: "/locations/miramar", label: "Miramar" },
          { href: "/locations/santurce", label: "Santurce" },
          { href: "/locations/hato-rey", label: "Hato Rey" },
        ],
      },
      {
        label: "Florida",
        href: null,
        children: [
          { href: "/locations/coral-gables", label: "Coral Gables" },
          { href: "/locations/brickell", label: "Brickell" },
          { href: "/locations/miami-beach", label: "Miami Beach" },
          { href: "/locations/edgewater", label: "Edgewater" },
          { href: "/locations/key-biscayne", label: "Key Biscayne" },
          { href: "/locations/coconut-grove", label: "Coconut Grove" },
        ],
      },
    ],
  },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

// Desktop nav links (excluding Home - logo handles that)
const desktopNavLinks = navLinks.filter((link) => link.href !== "/");

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" className="relative h-16 w-60 block">
              <Image
                src="/images/logoblanco2.png"
                alt="Elite Realty"
                fill
                className="object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {desktopNavLinks.map((link) =>
                link.dropdown ? (
                  /* Cascading dropdown */
                  <div key={link.href} className="relative group">
                    <button className="flex items-center gap-1 text-sm font-medium uppercase tracking-[0.1em] text-white hover:text-[#d4af37] transition-colors">
                      {link.label}
                      <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                    </button>

                    {/* Level-1 panel */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                      <div className="bg-[#111111] border border-[#2d2d2d] min-w-[190px] py-2 shadow-2xl">
                        {link.dropdown.map((item) =>
                          item.children ? (
                            /* "Active" — has sub-items */
                            <div key={item.label} className="relative group/sub">
                              <button className="flex items-center justify-between w-full px-5 py-2.5 text-sm uppercase tracking-[0.08em] whitespace-nowrap text-white hover:text-[#d4af37] hover:bg-[#1a1a1a] transition-colors">
                                {item.label}
                                <ChevronRight className="w-3.5 h-3.5 ml-4 text-[#a0a0a0]" />
                              </button>

                              {/* Level-2 sub-menu (appears to the right) */}
                              <div className="absolute left-full top-0 ml-px opacity-0 pointer-events-none group-hover/sub:opacity-100 group-hover/sub:pointer-events-auto transition-opacity duration-200">
                                <div className="bg-[#111111] border border-[#2d2d2d] min-w-[150px] py-2 shadow-2xl">
                                  {item.children.map((child) => (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      className="block px-5 py-2.5 text-sm uppercase tracking-[0.08em] text-white hover:text-[#d4af37] hover:bg-[#1a1a1a] transition-colors"
                                    >
                                      {child.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Direct links: Sold / Leased */
                            <Link
                              key={item.label}
                              href={item.href!}
                              className="block px-5 py-2.5 text-sm uppercase tracking-[0.08em] whitespace-nowrap text-white hover:text-[#d4af37] hover:bg-[#1a1a1a] transition-colors"
                            >
                              {item.label}
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium uppercase tracking-[0.1em] text-white hover:text-[#d4af37] transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right side: Phone + Menu */}
            <div className="flex items-center gap-4">
              <a
                href="tel:+17873083982"
                className="hidden sm:block text-sm tracking-wide text-[#d4af37] hover:text-white transition-colors"
              >
                (787) 308-3982
              </a>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-white hover:text-[#d4af37] transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}