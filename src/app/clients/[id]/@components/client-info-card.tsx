import { WWTClient } from "@/@shared/interfaces/wwt-client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ContainedLabelValue,
  ContainedLabelValueItem,
} from "@/components/ui/contained-label-value";

interface ClientInfoCardProps {
  data: WWTClient;
}

export function ClientInfoCard({ data }: ClientInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <ContainedLabelValue>
          <ContainedLabelValueItem label="Nome" value={undefined} />
          <ContainedLabelValueItem label="Username" />
          <ContainedLabelValueItem label="Email" />
          <ContainedLabelValueItem label="Contato (usuario)" />
          <ContainedLabelValueItem label="Contato (telefone)" />
          <ContainedLabelValueItem label="Endereço" />
          <ContainedLabelValueItem label="Qnt. de subclientes" />
        </ContainedLabelValue>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
