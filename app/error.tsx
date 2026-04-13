"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-red-500 text-sm uppercase tracking-[0.2em] mb-4">
          Error
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
          Something Went Wrong
        </h1>
        <p className="text-[#a0a0a0] text-lg mb-8 max-w-md mx-auto">
          We apologize for the inconvenience. Please try again.
        </p>
        <Button variant="primary" onClick={reset}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
