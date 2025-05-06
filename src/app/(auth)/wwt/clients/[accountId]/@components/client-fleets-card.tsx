"use server";

import { findOneBFleetClient } from "@/@shared/actions/bwfleet-client.actions";
import { WWTClient } from "@/@shared/interfaces/wwt-client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/view/components/ui/card";
import { UpsertBWFleetForm } from "@/view/forms/upsert-bwfleet/upsert-bwfleet.form";

interface ClientFleetsCardProps {
  wwtClient: WWTClient;
}

export async function ClientFleetsCard({ wwtClient }: ClientFleetsCardProps) {
  const bfleetClient = await findOneBFleetClient({
    where: {
      wwtAccountId: wwtClient.accountId,
    },
    include: {
      user: true,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do cliente BWFleets</CardTitle>
        <CardDescription>
          Dados atualizados (até o momento) para o esquema de dados da nova
          plataforma BWFleets
        </CardDescription>

        <CardAction>
          <UpsertBWFleetForm
            wwtClient={wwtClient}
            bfleetClient={bfleetClient}
          />
        </CardAction>
      </CardHeader>
    </Card>
  );
}
