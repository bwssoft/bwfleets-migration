import { IWanwayClient } from "@/@shared/interfaces/wwt-client";
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
import {
  CircleCheck,
  CircleDashed,
  CircleEllipsis,
  Hourglass,
  MailCheck,
  PhoneOff,
  UserRoundX,
  UserX,
} from "lucide-react";
import React from "react";

interface ClientMigrationCardProps {
  wwtClient: IWanwayClient;
}

export function ClientMigrationCard({ wwtClient }: ClientMigrationCardProps) {
  const migrationStatus = wwtClient.migration?.migration_status ?? "TO_DO";
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
          {alertData?.icon}
          <AlertTitle>Status atual: {alertData?.title}</AlertTitle>
          <AlertDescription>{alertData?.description}</AlertDescription>
        </Alert>
      </CardContent>

      {migrationStatus === "TO_DO" && (
        <CardFooter>
          <StartMigrationForm wwtClient={wwtClient} />
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
  INACTIVE: {
    icon: <UserRoundX />,
    title: "Cliente Inativo",
    description: "Atualmente esse cliente se encontra com status inativo"
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
    description:
      "Esse cliente foi marcado que não obteve comunicação, ou não foi identificado",
  },
  WAITING: {
    icon: <Hourglass />,
    title: "Aguardando resposta",
    description: "Aguardando resposta do cliente",
  },
  FAILED_BY_CLIENT: {
    icon: <UserX />,
    title: "Optou por não migrar",
    description: "O Cliente optou por não continuar a migração de dados",
  },
  DONE: {
    icon: <CircleCheck />,
    title: "Aceitou migrar",
    description: "Esse cliente aceitou a migração com sucesso.",
  },
  SUCCESS: {
    icon: <MailCheck />,
    title: 'Migração Concluída',
    description: "Esse cliente foi migrado para a BWFleets com successo"
  }
};
