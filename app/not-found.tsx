import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-[#d4af37] text-sm uppercase tracking-[0.2em] mb-4">
          404 Error
        </p>
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6">
          Page Not Found
        </h1>
        <p className="text-[#a0a0a0] text-lg mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="primary">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
