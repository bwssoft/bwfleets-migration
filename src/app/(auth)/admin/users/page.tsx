import { Topbar } from "@/view/components/navigation/topbar";
import { PageLayout } from "@/view/components/ui/layout";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/view/components/ui/breadcrumb";
import { Card, CardContent } from "@/view/components/ui/card";
import { Button } from "@/view/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { UsersTableLoader } from "@/view/tables/users.loader";
import { Suspense } from "react";
import { Skeleton } from "@/view/components/ui/skeleton";

export default async function AdminUsersPage() {
  return (
    <main className="grid grid-rows-[min-content_1fr] w-full h-screen overflow-y-hidden">
      <Topbar>
        <div className="flex w-full items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbPage>Usuários</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>

          <Button size="sm" asChild>
            <Link href="/admin/users/create">
              <PlusIcon />
              Cadastrar usuário
            </Link>
          </Button>
        </div>
      </Topbar>

      <PageLayout>
        <Card>
          <CardContent>
            <Suspense fallback={<Skeleton className="w-full h-96" />}>
              <UsersTableLoader />
            </Suspense>
          </CardContent>
        </Card>
      </PageLayout>
    </main>
  );
}
