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
import { MeetingLoader } from "@/view/tables/meeting.loader";
import { SearchParams } from "nuqs";
import { loadMeetingPageParams } from "./params";
import { SearchMeeting } from "@/view/forms/search-meeting";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function MeetingPage({ searchParams }: PageProps) {
  const nuqsParams = await loadMeetingPageParams(searchParams);

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
              <SearchMeeting />
              <MeetingLoader params={nuqsParams} />
            </Suspense>
          </CardContent>
        </Card>
      </PageLayout>
    </main>
  );
}
