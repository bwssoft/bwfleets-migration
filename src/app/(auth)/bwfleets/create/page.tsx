import { Topbar } from '@/view/components/navigation/topbar';
import { Breadcrumb, BreadcrumbList, BreadcrumbPage } from '@/view/components/ui/breadcrumb';
import { Card, CardContent } from '@/view/components/ui/card';
import { PageLayout } from '@/view/components/ui/layout';
import { Skeleton } from '@/view/components/ui/skeleton';
import { ClientFleetsForm } from '@/view/forms/create-client-bwfleet';
import React, { Suspense } from 'react';

export default async function CreateBfleetClient() {
  return (
    <main className="grid grid-rows-[min-content_1fr] w-full h-screen overflow-y-hidden">
      <Topbar>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbPage>Cadastre seus clientes na BWFleets</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
      </Topbar>

      <PageLayout>
        <Card className="w-full max-h-full overflow-hidden">
          <CardContent className="flex flex-col space-y-4 max-h-full overflow-hidden">
            <Suspense fallback={<Skeleton className="w-full h-96" />}>
              <ClientFleetsForm />
            </Suspense>
          </CardContent>
        </Card>
      </PageLayout>
    </main>
  )
}
