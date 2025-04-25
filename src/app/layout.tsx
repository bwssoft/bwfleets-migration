import "@fontsource-variable/inter";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "./globals.css";
import { Toaster } from "@/view/components/ui/sonner";

export const metadata: Metadata = {
  title: "BWS Migração",
  description: "Migração WWT pra BWFleets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-inter antialiased">
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
