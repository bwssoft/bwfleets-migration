import { WWTClientTable } from "@/components/table/wwt-client.table";
import { SearchClientForm } from "../../components/forms/search-client.form";
import { listAllClients } from "@/actions/clients/list.action";

import type { SearchParams } from "nuqs/server";
import { loadClientsSearchParams } from "@/lib/nuqs/clients.nuqs.loader";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function ClientsPage({ searchParams }: PageProps) {
  const { page, accountName } = await loadClientsSearchParams(searchParams);
  const { count, data } = await listAllClients({
    page,
    where: {
      userName: {
        contains: accountName as string,
        mode: "insensitive",
      },
      parentId: {
        equals: 10160758,
      },
    },
    orderBy: {
      userName: "asc",
    },
  });

  return (
    <main className="w-screen h-screen container text-sm">
      <div className="container p-6 pb-10 overflow-y-auto space-y-4">
        <header className="flex flex-col items-start justify-between">
          <h2 className="text-lg font-bold tracking-tight">
            Lista de clientes
          </h2>
          <p className="text-muted-foreground">
            Visualize a lista de clientes disponiveis para a migração
          </p>
        </header>

        <SearchClientForm />

        <section>
          <WWTClientTable
            data={data}
            pagination={{
              count,
              pageSize: 100,
            }}
          />
        </section>
      </div>
    </main>
  );
}
