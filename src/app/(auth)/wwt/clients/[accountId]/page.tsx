import { Topbar } from "@/view/components/navigation/topbar";
import { PageLayout } from "@/view/components/ui/layout";

import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/view/components/ui/breadcrumb";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/view/components/ui/card";
import { ArrowLeftRightIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/view/components/ui/button";
import { WWTClientTable } from "@/view/tables/wwt-client.table";
import { findOneClient } from "@/@shared/actions/wwt-client.actions";
import { ClientInfoCard } from "./@components/client-info-card";
import { ClientStatisticsCard } from "./@components/client-statistics-card";
import { Suspense } from "react";
import { ClientSubclientsCard } from "./@components/client-subclients-card";
import { Skeleton } from "@/view/components/ui/skeleton";
import { SearchParams } from "nuqs";
import { loadClientDetailsPageParams } from "./params";
import { ClientMigrationCard } from "./@components/client-migration-card";

interface PageProps {
  params: {
    accountId: string;
  };
  searchParams: Promise<SearchParams>;
}

export default async function WWTClientDetailsPage({
  params,
  searchParams,
}: PageProps) {
  const { accountId } = await params;
  const nuqsParams = await loadClientDetailsPageParams(searchParams);

  const client = await findOneClient({
    where: {
      accountId: Number(accountId),
    },
  });

  return (
    <main className="grid grid-rows-[min-content_1fr] w-full h-screen overflow-y-hidden">
      <Topbar>
        <div className="flex w-full justify-between items-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbLink asChild>
                <Link href="/wwt/clients">Clientes WWT</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
              <BreadcrumbPage>
                Detalhes do cliente {client.userName} ({client.accountName})
              </BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="destructive">
              <XCircleIcon />
              Sinalizar recusa
            </Button>
            <Button size="sm">
              <ArrowLeftRightIcon />
              Iniciar migração
            </Button>
          </div>
        </div>
      </Topbar>

      <PageLayout className="grid gap-4 grid-cols-8">
        <div className="col-span-6 space-y-4">
          <ClientInfoCard client={client} />

          <Suspense fallback={<Skeleton className="w-full h-96" />}>
            <ClientSubclientsCard
              client={client}
              page={nuqsParams.subclientsPage}
            />
          </Suspense>

          <Card>
            <CardHeader>
              <CardTitle>Dispositivos</CardTitle>
              <CardDescription>
                Dispositivos registrados por esse cliente. Inclui os
                dispositivos de suas subcontas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WWTClientTable data={[]} />
            </CardContent>
          </Card>

          <ClientMigrationCard client={client} />
        </div>
        <div className="col-span-2">
          <ClientStatisticsCard client={client} />
        </div>
      </PageLayout>
    </main>
  );
}
