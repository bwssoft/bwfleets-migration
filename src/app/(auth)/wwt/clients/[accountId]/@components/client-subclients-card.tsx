import { findManyClients } from "@/@shared/actions/wwt-client.actions";
import { WWTClient } from "@/@shared/interfaces/wwt-client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/view/components/ui/card";
import { WWTSubclientTable } from "@/view/tables/wwt-subclient.table";

interface ClientSubclientsCard {
  client: WWTClient;
  page?: number | null;
}

export async function ClientSubclientsCard({
  client,
  page,
}: ClientSubclientsCard) {
  const subclients = await findManyClients({
    where: {
      parentId: {
        equals: client.accountId,
      },
    },
    page,
    pageSize: 10,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subcontas</CardTitle>
        <CardDescription>
          Subcontas registradas por esse cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WWTSubclientTable
          // @ts-expect-error Ítalo: Eu não entendo do prisma mas isso me parece algo relacionado ao schema, mas não consegui resolver
          data={subclients.data}
          pagination={{
            count: subclients.count,
            pageSize: 10,
            pageUrlParam: "subclientsPage",
          }}
        />
      </CardContent>
    </Card>
  );
}
