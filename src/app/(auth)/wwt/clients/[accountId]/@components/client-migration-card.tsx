import {
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
import { MigrationStatus } from "@prisma/client";
import { CircleCheck, CircleDashed, CircleEllipsis, Hourglass, PhoneOff, UserX } from "lucide-react";
import React from "react";

interface ClientMigrationCardProps {
  client: WWTClient;
}

export function ClientMigrationCard({ client }: ClientMigrationCardProps) {
  const migrationStatus = client.migrationStatus ?? "TO_DO";
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

      {migrationStatus === "PENDING" && (
        <CardFooter>
          <StartMigrationForm client={client} />
        </CardFooter>
      )}
    </Card>
  );
}

type MigrationMapper = Record<
  MigrationStatus,
  {
    icon: React.ReactNode;
    title: string;
    description: string;
  }
>;

const ALERT_DATA: MigrationMapper = {
  TO_DO: {
    icon: <CircleDashed />,
    title: "Pendente",
    description:
      "Atualmente esse cliente não está marcado para ser migrado para a nova plataforma. Inicie o processo de migração abaixo para continuar.",
  },
  PENDING: {
    icon: <CircleEllipsis />,
    title: "Em andamento",
    description:
      "Esse cliente foi marcado com a intenção de ser migrado para a nova plataforma. O processo de migração está em andamento.",
  },
  FAILED_BY_CONTACT: {
    icon: <PhoneOff />,
    title: "Sem contato",
    description: "Esse cliente foi marcado que não obteve comunicação, ou não foi identificado"
  },
  WAITING: {
    icon: <Hourglass />,
    title: "Aguardando resposta",
    description: "Aguardando resposta do cliente"
  },
  FAILED_BY_CLIENT: {
    icon: <UserX />,
    title: "Optou por não migrar",
    description: "O Cliente optou por não continuar a migração de dados"
  },
  DONE: {
    icon: <CircleCheck />,
    title: "Concluído",
    description: "Esse cliente foi migrado com sucesso.",
  },
};
