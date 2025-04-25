import "@fontsource-variable/inter";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "../globals.css";
import { SidebarProvider } from "@/view/components/ui/sidebar";
import { AppSidebar } from "@/view/components/navigation/sidebar";
import { Toaster } from "@/view/components/ui/sonner";
import { auth } from "@/@shared/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  return (
    <html lang="en">
      <body className="font-inter antialiased">
        <NuqsAdapter>
          <SidebarProvider className="overflow-hidden">
            <AppSidebar />
            {children}
          </SidebarProvider>
        </NuqsAdapter>

        <Toaster />
      </body>
    </html>
  );
}
