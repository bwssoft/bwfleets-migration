"use client";

import { WWTClient } from "@/@shared/interfaces/wwt-client";
import { updateMigrationStatusAction } from "@/actions/clients/update-migration-status.action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckIcon, LoaderCircleIcon, TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";

type MigrationDescriptionsMapper = Record<
  string,
  {
    title: string;
    description: string;
    button?: string;
  }
>;

const MIGRATION_DESCRIPTIONS: MigrationDescriptionsMapper = {
  pending: {
    title: "Pendente",
    description:
      "Atualmente esse cliente não está marcado para ser migrado para a nova plataforma. Inicie o processo de migração abaixo para continuar.",
    button: "Iniciar processo de migracao",
  },
  "in-progress": {
    title: "Em progresso",
    description:
      "Esse cliente foi marcado com a intenção de ser migrado para a nova plataforma. O processo de migração está em andamento.",
  },
  done: {
    title: "Concluído",
    description: "Esse cliente foi migrado com sucesso.",
  },
};

interface ClientMigrateCardProps {
  data: WWTClient;
}

export function ClientMigrateCard({ data: client }: ClientMigrateCardProps) {
  const migrationStatus = client.migrationStatus ?? "pending";

  async function handlePendingFormSubmit() {
    try {
      console.log("oshi");
      const formData = new FormData();
      formData.append("clientId", client.id);
      formData.append("status", "in-progress");
      await updateMigrationStatusAction(formData);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Não foi possível atualizar o status do cliente", {
        description: error.message,
      });
    }
  }

  return (
    <form action={handlePendingFormSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Migração</CardTitle>
          <CardDescription>
            Acompanhe o processo migratório desse cliente da plataforma WWT para
            BWFleets
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Alert>
            {RenderMigrateAlertIcon(migrationStatus)}
            <AlertTitle>
              Status atual: {MIGRATION_DESCRIPTIONS[migrationStatus].title}
            </AlertTitle>
            <AlertDescription>
              {MIGRATION_DESCRIPTIONS[migrationStatus].description}
            </AlertDescription>
          </Alert>
        </CardContent>

        {(!client.migrationStatus || client.migrationStatus === "pending") && (
          <CardFooter>
            <Button type="submit">
              {MIGRATION_DESCRIPTIONS[migrationStatus].button}
            </Button>
          </CardFooter>
        )}
      </Card>
    </form>
  );
}

function RenderMigrateAlertIcon(migrationStatus?: string) {
  switch (migrationStatus) {
    case "in-progress":
      return <LoaderCircleIcon className="h-4 w-4 animate-spin" />;
    case "done":
      return <CheckIcon className="h-4 w-4" />;
    default:
      return <TriangleAlertIcon className="h-4 w-4 animate-pulse" />;
  }
}
