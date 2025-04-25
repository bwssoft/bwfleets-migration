import { Topbar } from "@/view/components/navigation/topbar";
import { PageLayout } from "@/view/components/ui/layout";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/view/components/ui/breadcrumb";
import { Card, CardContent } from "@/view/components/ui/card";
import { UsersTable } from "@/view/tables/users.table";
import { findManyWithSessions } from "@/@shared/actions/user.actions";
import { Button } from "@/view/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function AdminUsersPage() {
  const users = await findManyWithSessions();

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
            <UsersTable data={users} />
          </CardContent>
        </Card>
      </PageLayout>
    </main>
  );
}
