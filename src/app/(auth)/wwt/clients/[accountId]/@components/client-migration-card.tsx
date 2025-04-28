import {
  MigrationStatusEnum,
  WWTClient,
} from "@/@shared/interfaces/wwt-client";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/view/components/ui/alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/view/components/ui/card";
import { StartMigrationForm } from "@/view/forms/start-migration.form";
import { CircleCheck, CircleDashed, CircleEllipsis } from "lucide-react";
import React from "react";

interface ClientMigrationCardProps {
  client: WWTClient;
}

export function ClientMigrationCard({ client }: ClientMigrationCardProps) {
  const migrationStatus = client.migrationStatus ?? "pending";
  const alertData = ALERT_DATA[migrationStatus as never] as {
    icon: string;
    title: string;
    description: string;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status de migração</CardTitle>
        <CardDescription>
          Acompanhe ou atualize o processo migratório desse cliente da
          plataforma WWT para BWFleets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          {alertData.icon}
          <AlertTitle>Status atual: {alertData.title}</AlertTitle>
          <AlertDescription>{alertData.description}</AlertDescription>
        </Alert>
      </CardContent>

      {migrationStatus === "pending" && (
        <CardFooter>
          <StartMigrationForm client={client} />
        </CardFooter>
      )}
    </Card>
  );
}

type MigrationMapper = Record<
  MigrationStatusEnum,
  {
    icon: React.ReactNode;
    title: string;
    description: string;
  }
>;

const ALERT_DATA: MigrationMapper = {
  pending: {
    icon: <CircleDashed />,
    title: "Pendente",
    description:
      "Atualmente esse cliente não está marcado para ser migrado para a nova plataforma. Inicie o processo de migração abaixo para continuar.",
  },
  "in-progress": {
    icon: <CircleEllipsis />,
    title: "Em andamento",
    description:
      "Esse cliente foi marcado com a intenção de ser migrado para a nova plataforma. O processo de migração está em andamento.",
  },
  done: {
    icon: <CircleCheck />,
    title: "Concluído",
    description: "Esse cliente foi migrado com sucesso.",
  },
};
