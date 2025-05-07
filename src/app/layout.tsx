import "@fontsource-variable/inter";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "./globals.css";
import { Toaster } from "@/view/components/ui/sonner";
import { ReactQueryClientProvider } from "@/@shared/lib/tanstack-query";

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
      <ReactQueryClientProvider>
        <body className="font-inter antialiased">
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster />
        </body>
      </ReactQueryClientProvider>
    </html>
  );
}
