import { findManyClients } from "@/@shared/actions/wwt-client.actions";
import { IWanwayClient } from "@/@shared/interfaces/wwt-client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/view/components/ui/card";
import { WWTSubclientTable } from "@/view/tables/wwt-subclient.table";

interface ClientSubclientsCard {
  wwtClient: IWanwayClient;
  page?: number | null;
}

export async function ClientSubclientsCard({
  wwtClient,
  page,
}: ClientSubclientsCard) {
  const { data, count } = await findManyClients({
    where: {
      parentId: {
        equals: wwtClient.accountId,
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
          data={data}
          pagination={{
            count,
            pageSize: 10,
            pageUrlParam: "subclientsPage",
          }}
        />
      </CardContent>
    </Card>
  );
}
