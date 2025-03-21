import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

import { findOneClient } from "@/actions/clients/find-one.action";

import { ClientInfoCard } from "./@components/client-info-card";
import { ClientDeviceStatsCard } from "./@components/client-device-stats-card";
import { ClientSubclientsCard } from "./@components/client-subclients-card";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ClientDetailsPage(pageProps: PageProps) {
  const { id } = await pageProps.params;
  const client = await findOneClient(Number(id));

  return (
    <main className="w-screen h-screen container text-sm">
      <div className="container p-6 pb-12 overflow-y-auto space-y-4">
        <header className="flex flex-col items-start justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/clients">Lista de clientes</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Sergio Ramos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h2 className="text-lg font-bold tracking-tight">
            Detalhes do cliente
          </h2>
        </header>

        <ClientInfoCard data={client} />
        <ClientDeviceStatsCard />
        <ClientSubclientsCard />
      </div>
    </main>
  );
}
