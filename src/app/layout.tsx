import type { Metadata } from "next";
import "./globals.css";
import type React from "react"; // Import React
import { cn } from "@/lib/utils";
import { SessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "AIsumo - AI Tools Marketplace",
  description:
    "Discover the best AI tools at unbeatable prices. Lifetime access to premium software with no monthly fees.",
  keywords: [
    "ai tools",
    "marketplace",
    "lifetime deals",
    "appsumo",
    "artificial intelligence",
    "software deals",
    "ai marketplace",
    "lifetime access",
    "premium software",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("font-sans", "antialiased")}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
