import { Topbar } from "@/view/components/navigation/topbar";
import { PageLayout } from "@/view/components/ui/layout";

import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/view/components/ui/breadcrumb";
import { Button } from "@/view/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { CreateUserForm } from "@/view/forms/create-user.form";

export default function AdminCreateUserPage() {
  return (
    <main className="grid grid-rows-[min-content_1fr] w-full h-screen overflow-y-hidden">
      <Topbar>
        <div className="flex w-full items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbLink asChild>
                <Link href="/admin/users">Usuários</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
              <BreadcrumbPage>Cadastrar usuário</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>

          <Button size="sm">
            <PlusIcon />
            Cadastrar usuário
          </Button>
        </div>
      </Topbar>

      <PageLayout className="container mx-auto max-w-[40vw]">
        <CreateUserForm />
      </PageLayout>
    </main>
  );
}
