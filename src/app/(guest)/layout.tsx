import "@fontsource-variable/inter";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "../globals.css";
import { Toaster } from "@/view/components/ui/sonner";
import { auth } from "@/@shared/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Migração WWT - Login",
  description: "Entre para continuar",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect("/home");
  }

  return (
    <html lang="en">
      <body className="font-inter antialiased">
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
