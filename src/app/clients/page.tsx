import { WWTClientTable } from "@/components/table/wwt-client.table";
import { SearchClientForm } from "../../components/forms/search-client.form";

export default function ClientsPage() {
  return (
    <main className="w-screen h-screen container p-6 text-sm space-y-4">
      <header className="flex flex-col items-start justify-between">
        <h2 className="text-lg font-bold tracking-tight">Lista de clientes</h2>
        <p className="text-muted-foreground">
          Visualize a lista de clientes disponiveis para a migração
        </p>
      </header>

      <SearchClientForm />

      <section>
        <WWTClientTable data={[]} />
      </section>
    </main>
  );
}
