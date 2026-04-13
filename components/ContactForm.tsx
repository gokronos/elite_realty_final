"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { ContactFormData } from "@/types";

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setStatus("error");
      setErrorMessage("Failed to send message. Please try again.");
    }
  };

  const inputStyles = cn(
    "w-full px-4 py-3 bg-[#1a1a1a] border border-[#2d2d2d] text-white",
    "placeholder:text-[#6b6b6b]",
    "focus:outline-none focus:border-white transition-colors"
  );

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#d4af37]/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl text-white mb-2">Message Sent</h3>
        <p className="text-[#a0a0a0]">
          Thank you for reaching out. Alexandra will be in touch soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-[#d4af37] hover:text-white transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot field for spam protection */}
      <input
        type="text"
        name="website"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div>
        <label htmlFor="name" className="block text-white mb-2 text-sm">
          Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={inputStyles}
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-white mb-2 text-sm">
          Email *
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={inputStyles}
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-white mb-2 text-sm">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className={inputStyles}
          placeholder="+1 (555) 000-0000"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-white mb-2 text-sm">
          Message *
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={cn(inputStyles, "resize-none")}
          placeholder="Tell us about your real estate needs..."
        />
      </div>

      {status === "error" && (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        disabled={status === "loading"}
        className="w-full"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
