import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Citizen of Arcanis - Marketplace",
  description: "Trade everything in the cyberpunk universe of Arcanis. From weapons to augmentations, your legend awaits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
