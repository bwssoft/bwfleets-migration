"use client";

import { useDisclosure } from "@/@shared/hooks/use-disclosure";
import { WWTClient } from "@/@shared/interfaces/wwt-client";
import { Button } from "@/view/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/view/components/ui/card";
import { UpsertBWFleetForm } from "@/view/forms/upsert-bwfleet/upsert-bwfleet.form";
import { PencilIcon } from "lucide-react";

interface ClientFleetsCardProps {
  client: WWTClient;
}

export function ClientFleetsCard({ client }: ClientFleetsCardProps) {
  const editFormDisclosure = useDisclosure();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do cliente BWFleets</CardTitle>
        <CardDescription>
          Dados atualizados (até o momento) para o esquema de dados da nova
          plataforma BWFleets
        </CardDescription>

        <CardAction>
          <Button onClick={editFormDisclosure.onOpen} variant="outline">
            <PencilIcon />
            Editar
          </Button>
        </CardAction>
      </CardHeader>

      <UpsertBWFleetForm
        client={client}
        open={editFormDisclosure.isOpen}
        onOpenChange={editFormDisclosure.onClose}
      />
    </Card>
  );
}
