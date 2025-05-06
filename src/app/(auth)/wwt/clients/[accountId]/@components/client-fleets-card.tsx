"use client";

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
  client: WWTClient;
}

export function ClientFleetsCard({ client }: ClientFleetsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do cliente BWFleets</CardTitle>
        <CardDescription>
          Dados atualizados (até o momento) para o esquema de dados da nova
          plataforma BWFleets
        </CardDescription>

        <CardAction>
          <UpsertBWFleetForm wwtClient={client} />
        </CardAction>
      </CardHeader>
    </Card>
  );
}
