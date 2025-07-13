import type { Metadata } from "next";
import "./globals.css";
import type React from "react"; // Import React
import { cn } from "@/lib/utils";
import { SessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "Atmet - Premium AI Tools Marketplace",
  description:
    "Discover the best AI tools at unbeatable prices. Lifetime access to premium software with no monthly fees. The ultimate marketplace for entrepreneurs and businesses.",
  keywords: [
    "ai tools",
    "marketplace",
    "lifetime deals",
    "appsumo alternative",
    "artificial intelligence",
    "software deals",
    "ai marketplace",
    "lifetime access",
    "premium software",
    "business tools",
    "productivity",
    "saas deals",
  ],
  openGraph: {
    title: "Atmet - Premium AI Tools Marketplace",
    description: "Discover the best AI tools at unbeatable prices. Lifetime access to premium software with no monthly fees.",
    type: "website",
    url: "https://atmet.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atmet - Premium AI Tools Marketplace",
    description: "Discover the best AI tools at unbeatable prices. Lifetime access to premium software with no monthly fees.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn(
        "min-h-full font-sans antialiased",
        "bg-white text-black",
        "selection:bg-black selection:text-white"
      )}>
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
