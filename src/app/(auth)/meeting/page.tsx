import { Topbar } from "@/view/components/navigation/topbar";
import { PageLayout } from "@/view/components/ui/layout";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/view/components/ui/breadcrumb";
import { Card, CardContent } from "@/view/components/ui/card";

import { Skeleton } from "@/view/components/ui/skeleton";
import { Suspense } from "react";

export default async function MeetingPage() {

  return (
    <main className="grid grid-rows-[min-content_1fr] w-full h-screen overflow-y-hidden">
      <Topbar>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbPage>Reuniões com clientes</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>
      </Topbar>

      <PageLayout>
        <Card className="w-full">
          <CardContent className="space-y-4">
            <Suspense fallback={<Skeleton className="w-full h-96" />}>
            </Suspense>
          </CardContent>
        </Card>
      </PageLayout>
    </main>
  );
}
