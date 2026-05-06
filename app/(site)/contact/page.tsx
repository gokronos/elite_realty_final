import { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateContactSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Alexandra Lugo for luxury real estate inquiries in Puerto Rico and Miami.",
};

export default function ContactPage() {
  const schemaData = generateContactSchema();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <JsonLd data={schemaData} />
      {/* Header */}
      <section className="pt-16 pb-8 px-4">
        <div className="container mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            Contact
          </h1>
          <p className="text-[#a0a0a0] text-lg max-w-2xl">
            Ready to find your perfect property? Get in touch to discuss your
            real estate goals.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-[#1a1a1a] border border-[#2d2d2d] p-8 lg:p-12">
              <h2 className="font-serif text-2xl text-white mb-8">
                Send a Message
              </h2>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="space-y-12">
              <div>
                <h2 className="font-serif text-2xl text-white mb-8">
                  Available by appointment
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#1a1a1a] border border-[#2d2d2d]">
                      <Mail className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div>
                      <p className="text-[#a0a0a0] text-sm mb-1">Email</p>
                      <a
                        href="mailto:info@eliterealtypr.com"
                        className="text-white hover:text-[#d4af37] transition-colors"
                      >
                        info@eliterealtypr.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#1a1a1a] border border-[#2d2d2d]">
                      <Phone className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div>
                      <p className="text-[#a0a0a0] text-sm mb-1">Phone</p>
                      <a
                        href="tel:+17873083982"
                        className="text-white hover:text-[#d4af37] transition-colors"
                      >
                        +1 (787) 308-3982
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#1a1a1a] border border-[#2d2d2d]">
                      <MapPin className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div>
                      <p className="text-[#a0a0a0] text-sm mb-1">Location</p>
                      <p className="text-white">San Juan, Puerto Rico</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div>
                <h3 className="font-serif text-xl text-white mb-4">
                  Office Hours
                </h3>
                <div className="space-y-2 text-[#a0a0a0]">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: By appointment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
