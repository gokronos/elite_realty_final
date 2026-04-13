import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio | Elite Realty",
  description: "Content management studio for Elite Realty",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
