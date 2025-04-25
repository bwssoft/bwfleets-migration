import { WWTClient } from "@/@shared/interfaces/wwt-client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/view/components/ui/card";
import { LabelValue } from "@/view/components/ui/label-value";

interface ClientInfoCardProps {
  client: WWTClient;
}

export function ClientInfoCard({ client }: ClientInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do cliente</CardTitle>
        <CardDescription>
          Dados encontrados no registro desse cliente na WWT
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 2xl:grid-cols-3 gap-4 my-4">
        <LabelValue label="Nome" value={client.userName} />
        <LabelValue label="Login" value={client.accountName} />
        <LabelValue label="Email" value={client.email} />
        <LabelValue label="Contato digital" value={client.contactUser} />
        <LabelValue label="Contato telefonico" value={client.contactTel} />
        <LabelValue label="Endereco" value={client.address} />
      </CardContent>
    </Card>
  );
}
