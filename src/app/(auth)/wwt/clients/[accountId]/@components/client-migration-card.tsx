import {
  MigrationStatusEnum,
  WWTClient,
} from "@/@shared/interfaces/wwt-client";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/view/components/ui/alert";
import { Badge } from "@/view/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/view/components/ui/card";
import { StartMigrationForm } from "@/view/forms/start-migration.form";

interface ClientMigrationCardProps {
  client: WWTClient;
}

export function ClientMigrationCard({ client }: ClientMigrationCardProps) {
  const migrationStatus = client.migrationStatus ?? "pending";
  const alertData = ALERT_DATA[migrationStatus as never] as {
    title: string;
    description: string;
  };

  const alertInfo = {
    title: alertData.title,
    description: alertData.description,
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
          <AlertTitle>
            Status de migração atual: <Badge>{alertInfo.title}</Badge>
          </AlertTitle>
          <AlertDescription>{alertInfo.description}</AlertDescription>
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
    title: string;
    description: string;
  }
>;

const ALERT_DATA: MigrationMapper = {
  pending: {
    title: "Pendente",
    description:
      "Atualmente esse cliente não está marcado para ser migrado para a nova plataforma. Inicie o processo de migração abaixo para continuar.",
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
