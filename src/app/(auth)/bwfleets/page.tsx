import { Topbar } from '@/view/components/navigation/topbar';
import { Breadcrumb, BreadcrumbList, BreadcrumbPage } from '@/view/components/ui/breadcrumb';
import { Card, CardContent } from '@/view/components/ui/card';
import { PageLayout } from '@/view/components/ui/layout';
import { Skeleton } from '@/view/components/ui/skeleton';
import { BFleetClientsLoader } from '@/view/tables/bfleet-clients-loader';
import React, { Suspense } from 'react';
import { SearchParams } from 'nuqs';
import { SearchBfleetClient } from '@/view/forms/search-bfleet-client';
import { loadBfleetClientsPageParams } from './params';

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function CreateClientPage({ searchParams }: PageProps) {
  const nuqsParams = await loadBfleetClientsPageParams(searchParams);

  return (
    <main className="grid grid-rows-[min-content_1fr] w-full h-screen overflow-y-hidden">
      <Topbar>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbPage>Seus clientes da BWFleets</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
      </Topbar>

      <PageLayout>
        <Card className="w-full">
          <CardContent className="space-y-4">
            <SearchBfleetClient />
            <Suspense fallback={<Skeleton className="w-full h-96" />}>
              <BFleetClientsLoader params={nuqsParams} />
            </Suspense>
          </CardContent>
        </Card>
      </PageLayout>
    </main>
  )
}
