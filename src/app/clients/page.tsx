import { WWTClientTable } from "@/components/table/wwt-client.table";
import { SearchClientForm } from "../../components/forms/search-client.form";

export default function ClientsPage() {
  return (
    <main className="w-screen h-screen container p-6 text-sm space-y-4">
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-bold tracking-tight">Clientes</h3>
        <SearchClientForm />
      </header>

      <section>
        <WWTClientTable data={[]} />
      </section>
    </main>
  );
}
