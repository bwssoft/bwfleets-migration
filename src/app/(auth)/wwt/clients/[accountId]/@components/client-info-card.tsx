import { generateUserSummary } from "@/@shared/actions/wwt-client.actions";
import { IWanwayClient } from "@/@shared/interfaces/wwt-client";
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
  wwtClient: IWanwayClient;
}

export async function ClientInfoCard({ wwtClient }: ClientInfoCardProps) {
  const summary = await generateUserSummary(wwtClient);

  return (
    <div className="flex gap-4 w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Informações do cliente</CardTitle>
          <CardDescription>
            Dados encontrados no registro desse cliente na WWT
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 my-4">
          <LabelValue label="Nome" value={wwtClient.userName} />
          <LabelValue label="Login" value={wwtClient.accountName} />
          <LabelValue label="Email" value={wwtClient.email} />
          <LabelValue label="Contato digital" value={wwtClient.contactUser} />
          <LabelValue label="Contato telefonico" value={wwtClient.contactTel} />
          <LabelValue label="Endereco" value={wwtClient.address} />
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
