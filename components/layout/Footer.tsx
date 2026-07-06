import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

const socialLinks = [
  { href: "https://www.instagram.com/eliterealtyllc/", icon: Instagram, label: "Instagram" },
  { href: "https://www.facebook.com/p/Elite-Realty-100057346372543/", icon: Facebook, label: "Facebook" },
  { href: "https://www.linkedin.com/in/alexandra-lugo-317b7880/", icon: Linkedin, label: "LinkedIn" },
];

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/property", label: "Properties" },
  { href: "/locations", label: "Locations" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#2d2d2d]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="relative h-16 w-20 block mb-4">
              <Image
                src="/images/unnamed.jpg"
                alt="Elite Realty"
                fill
                className="object-contain"
                sizes="80px"
              />
            </Link>
            <p className="text-[#a0a0a0] text-sm leading-relaxed">
              Luxury real estate in Puerto Rico and Miami.
              Curated properties for discerning clients.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#a0a0a0] hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">
              Contact
            </h4>
            <div className="space-y-3 text-[#a0a0a0] text-sm">
              <p>
                <a
                  href="mailto:info@eliterealtypr.com"
                  className="hover:text-white transition-colors"
                >
                  info@eliterealtypr.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+17873083982"
                  className="hover:text-white transition-colors"
                >
                  (787) 308-3982
                </a>
              </p>
              <p>San Juan, Puerto Rico</p>
              <p className="text-[#6b6b6b] text-xs mt-2">
                PR Lic. C-19793 | FL 3507350
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-10 h-10 flex items-center justify-center",
                    "border border-[#2d2d2d] text-[#a0a0a0]",
                    "hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
                  )}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-[#2d2d2d]">
          <p className="text-center text-[#6b6b6b] text-sm">
            © {currentYear} Elite Realty. All rights reserved. Design and Development by Imagen Plus AMD
          </p>
        </div>
      </div>
    </footer>
  );
}
