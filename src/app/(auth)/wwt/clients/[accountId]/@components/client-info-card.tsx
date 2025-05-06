import { generateUserSummary } from "@/@shared/actions/wwt-client.actions";
import { WWTClient } from "@/@shared/interfaces/wwt-client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/view/components/ui/card";
import { LabelValue } from "@/view/components/ui/label-value";
import { SparklesIcon } from "lucide-react";
import { ClientInfoCopyButton } from "./client-info-copy-button";

interface ClientInfoCardProps {
  client: WWTClient;
}

export async function ClientInfoCard({ client }: ClientInfoCardProps) {
  const summary = await generateUserSummary(client);

  return (
    <div className="flex gap-4 w-full">
      <Card className="w-full">
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex gap-1">
            <SparklesIcon className="w-4 h-4" />
            <span>Sugestão de texto</span>
          </CardTitle>
          <CardDescription>
            Sugestão de resumo com base nos dados do cliente
          </CardDescription>

          <CardAction>
            <ClientInfoCopyButton text={summary} />
          </CardAction>
        </CardHeader>
        <CardContent className="max-w-[80%] -mt-2">
          <span className="text-sm font-medium">{summary}</span>
        </CardContent>
      </Card>
    </div>
  );
}
