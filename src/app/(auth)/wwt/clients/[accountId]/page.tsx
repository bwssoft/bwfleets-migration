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
import { findOneClient } from "@/@shared/actions/wwt-client.actions";
import { ClientInfoCard } from "./@components/client-info-card";
import { ClientStatisticsCard } from "./@components/client-statistics-card";
import { Suspense } from "react";
import { ClientSubclientsCard } from "./@components/client-subclients-card";
import { Skeleton } from "@/view/components/ui/skeleton";
import { SearchParams } from "nuqs";
import { loadClientDetailsPageParams } from "./params";
import { ClientMigrationCard } from "./@components/client-migration-card";
import { WWTDevicesTableLoader } from "@/view/tables/wwt-devices.loader";
import { StartMigrationForm } from "@/view/forms/start-migration.form";
import { ClientFleetsCard } from "./@components/client-fleets-card";
import { ClientCommentsCard } from "./@components/client-comments-card";
import { ClientStatusMigrationCard } from "./@components/client-status-migration-card";
import { ClientAssignedCard } from "./@components/client-assigned-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/view/components/ui/accordion";
import { Badge } from "@/view/components/ui/badge";
import { MigrationCard } from "./@components/migration-card";
import { MeetingCard } from "./@components/meeting-card";

interface PageProps {
  params: Promise<{
    accountId: string;
  }>;
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

  const isMigrating =
    client.migration && client.migration?.migration_status !== "TO_DO";

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
            {/* <Button size="sm" variant="destructive">
              <XCircleIcon />
              Sinalizar recusa
            </Button> */}

            <StartMigrationForm wwtClient={client} />
          </div>
        </div>
      </Topbar>

      <PageLayout className="grid gap-4 grid-cols-8">
        <div className="col-span-6 space-y-4">
          <ClientInfoCard wwtClient={client} />

          {isMigrating && (
            <Suspense fallback={<Skeleton className="w-full h-96" />}>
              <ClientFleetsCard wwtClient={client} />
            </Suspense>
          )}

          <Suspense fallback={<Skeleton className="w-full h-96" />}>
            <ClientSubclientsCard
              wwtClient={client}
              page={nuqsParams.subclientsPage}
            />
          </Suspense>

          <Card>
            <CardHeader>
              <CardTitle>Dispositivos</CardTitle>
              <CardDescription>
                Lista de dispositivos que esse cliente é proprietário.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WWTDevicesTableLoader
                params={{
                  ownerId: client.accountId,
                  page: nuqsParams.devicesPage,
                }}
              />
            </CardContent>
          </Card>

          <ClientMigrationCard wwtClient={client} />
        </div>
        <div className="col-span-2">
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(95vh-60px)] sticky top-0">
            <ClientAssignedCard wwtClient={client} />

            <ClientStatusMigrationCard
              migration_uuid={client.migration?.uuid}
              hidden={!isMigrating}
              status={client.migration?.migration_status}
            />

            <MigrationCard
              id={client.migration?.uuid}
              migration_token={client.migration?.migration_token}
              status={client.migration?.migration_status}
              account_id={client.accountId}
            />

            {client.migration?.migration_token?.bfleet_uuid ? (
              <MeetingCard
                customer={{
                  company:
                    client.migration?.bfleet_client?.name ?? client.accountName,
                  email: client.email ?? "",
                  id: client.id,
                  name:
                    client.migration?.bfleet_client?.name ?? client.accountName,
                  phone: client.contactTel,
                }}
                meeting={client.Meeting[0]}
                wwt_account_id={client.accountId}
              />
            ) : null}

            <Card className="!p-0">
              <CardContent className="!p-0">
                <Accordion
                  type="multiple"
                  defaultValue={!isMigrating ? ["stats"] : undefined}
                >
                  <AccordionItem value="stats">
                    <AccordionTrigger className="px-6">
                      Estatísticas gerais
                    </AccordionTrigger>
                    <AccordionContent>
                      <ClientStatisticsCard wwtClient={client} />
                    </AccordionContent>
                  </AccordionItem>

                  {isMigrating && (
                    <AccordionItem value="comments">
                      <AccordionTrigger className="px-6">
                        <div className="flex items-center gap-2">
                          Comentários da migração{" "}
                          <Badge variant="blue">
                            {client.migration?.comments?.length ?? 0}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-0">
                        <ClientCommentsCard
                          wwt_account_id={client.accountId}
                          hidden={!isMigrating}
                          migration_uuid={client.migration?.uuid}
                          data={client.migration?.comments ?? []}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageLayout>
    </main>
  );
}
