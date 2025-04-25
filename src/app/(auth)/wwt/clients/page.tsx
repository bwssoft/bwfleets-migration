import { Topbar } from "@/view/components/navigation/topbar";
import { PageLayout } from "@/view/components/ui/layout";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/view/components/ui/breadcrumb";
import { Card, CardContent } from "@/view/components/ui/card";
import { SearchClientForm } from "@/view/forms/search-client.form";

import type { SearchParams } from "nuqs/server";
import { loadClientsPageParams } from "./params";
import { WWTClientTableLoader } from "@/view/tables/wwt-client.loader";
import { Suspense } from "react";
import { Skeleton } from "@/view/components/ui/skeleton";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function WWTClientsPage({ searchParams }: PageProps) {
  const nuqsParams = await loadClientsPageParams(searchParams);

  return (
    <main className="grid grid-rows-[min-content_1fr] w-full h-screen overflow-y-hidden">
      <Topbar>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbPage>Clientes WWT</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
      </Topbar>

      <PageLayout>
        <Card className="w-full">
          <CardContent className="space-y-4">
            <SearchClientForm />
            <Suspense fallback={<Skeleton className="w-full h-96" />}>
              <WWTClientTableLoader params={nuqsParams} />
            </Suspense>
          </CardContent>
        </Card>
      </PageLayout>
    </main>
  );
}
