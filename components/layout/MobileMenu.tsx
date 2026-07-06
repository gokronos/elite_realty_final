"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Instagram, Facebook, Linkedin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "./Header";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const [openSubSubmenus, setOpenSubSubmenus] = useState<Record<string, boolean>>({});

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSubSubmenu = (key: string) => {
    setOpenSubSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClose = () => {
    setOpenDropdowns({});
    setOpenSubmenus({});
    setOpenSubSubmenus({});
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/80 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-md",
          "bg-[#0a0a0a]",
          "transform transition-transform duration-300 ease-out",
          "flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-6">
          <Link href="/" onClick={handleClose} className="relative h-10 w-12 block">
            <Image src="/images/unnamed.jpg" alt="Elite Realty" fill className="object-contain" sizes="48px" />
          </Link>
          <button onClick={handleClose} className="p-2 text-white hover:text-[#d4af37] transition-colors" aria-label="Close menu">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-6 py-8 overflow-y-auto">
          <ul className="space-y-5">
            {navLinks.map((link) => (
              <li key={link.href}>
                {link.dropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(link.label)}
                      className={cn(
                        "flex items-center justify-between w-full text-lg uppercase tracking-[0.15em] py-1 transition-colors duration-200",
                        openDropdowns[link.label] ? "text-[#d4af37]" : "text-white hover:text-[#d4af37]"
                      )}
                    >
                      {link.label}
                      <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", openDropdowns[link.label] && "rotate-180")} />
                    </button>

                    <div className={cn("overflow-hidden transition-all duration-300", openDropdowns[link.label] ? "max-h-[36rem] mt-3" : "max-h-0")}>
                      {link.dropdown.map((item) => (
                        <div key={item.label}>
                          {item.children ? (
                            <div>
                              <button
                                onClick={() => toggleSubmenu(`${link.label}-${item.label}`)}
                                className={cn(
                                  "flex items-center justify-between w-full pl-4 py-1.5 text-sm uppercase tracking-[0.12em] transition-colors",
                                  openSubmenus[`${link.label}-${item.label}`] ? "text-[#d4af37]" : "text-white/80 hover:text-[#d4af37]"
                                )}
                              >
                                {item.label}
                                <ChevronDown
                                  className={cn(
                                    "w-3.5 h-3.5 mr-1 transition-transform duration-200",
                                    openSubmenus[`${link.label}-${item.label}`] && "rotate-180"
                                  )}
                                />
                              </button>
                            <div
                                className={cn(
                                  "overflow-hidden transition-all duration-300",
                                  openSubmenus[`${link.label}-${item.label}`] ? "max-h-96 mb-1" : "max-h-0"
                                )}
                              >
                                {item.children.map((child) =>
                                  child.subChildren ? (
                                    <div key={child.label}>
                                      <button
                                        onClick={() => toggleSubSubmenu(`${link.label}-${item.label}-${child.label}`)}
                                        className={cn(
                                          "flex items-center justify-between w-full pl-8 py-1.5 text-sm uppercase tracking-[0.1em] transition-colors",
                                          openSubSubmenus[`${link.label}-${item.label}-${child.label}`] ? "text-[#d4af37]" : "text-white/60 hover:text-[#d4af37]"
                                        )}
                                      >
                                        {child.label}
                                        <ChevronDown
                                          className={cn(
                                            "w-3 h-3 mr-1 transition-transform duration-200",
                                            openSubSubmenus[`${link.label}-${item.label}-${child.label}`] && "rotate-180"
                                          )}
                                        />
                                      </button>
                                      <div
                                        className={cn(
                                          "overflow-hidden transition-all duration-300",
                                          openSubSubmenus[`${link.label}-${item.label}-${child.label}`] ? "max-h-40 mb-1" : "max-h-0"
                                        )}
                                      >
                                        {child.subChildren.map((sub) => (
                                          <Link key={sub.href} href={sub.href} onClick={handleClose} className="block pl-12 py-1.5 text-xs uppercase tracking-[0.1em] text-white/50 hover:text-[#d4af37] transition-colors">
                                            {sub.label}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <Link key={child.href} href={child.href!} onClick={handleClose} className="block pl-8 py-1.5 text-sm uppercase tracking-[0.1em] text-white/60 hover:text-[#d4af37] transition-colors">
                                      {child.label}
                                    </Link>
                                  )
                                )}
                              </div>
                            </div>
                          ) : (
                            <Link href={item.href!} onClick={handleClose} className="block pl-4 py-1.5 text-sm uppercase tracking-[0.12em] text-white/80 hover:text-[#d4af37] transition-colors">
                              {item.label}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link href={link.href} onClick={handleClose} className="block text-lg uppercase tracking-[0.15em] text-white hover:text-[#d4af37] transition-colors duration-200 py-1">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer: Contact + Socials */}
        <div className="p-6 border-t border-[#2d2d2d]">
          <div className="space-y-2 mb-6">
            <a href="tel:+17873083982" className="block text-sm text-white hover:text-[#d4af37] transition-colors">(787) 308-3982</a>
            <a href="mailto:info@eliterealtypr.com" className="block text-sm text-[#a0a0a0] hover:text-[#d4af37] transition-colors">info@eliterealtypr.com</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/eliterealtyllc/" target="_blank" rel="noopener noreferrer" className="text-[#a0a0a0] hover:text-[#d4af37] transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
            <a href="https://www.facebook.com/p/Elite-Realty-100057346372543/" target="_blank" rel="noopener noreferrer" className="text-[#a0a0a0] hover:text-[#d4af37] transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
            <a href="https://www.linkedin.com/in/alexandra-lugo-317b7880/" target="_blank" rel="noopener noreferrer" className="text-[#a0a0a0] hover:text-[#d4af37] transition-colors" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
          </div>
          <p className="mt-4 text-xs text-[#6b6b6b]">PR Lic. C-19793 | FL 3507350</p>
        </div>
      </div>
    </>
  );
}
