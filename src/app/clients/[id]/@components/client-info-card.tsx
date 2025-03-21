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
          <ContainedLabelValueItem label="Nome" value={data.accountName} />
          <ContainedLabelValueItem label="Username" value={data.userName} />
          <ContainedLabelValueItem label="Email" value={data.email} />
          <ContainedLabelValueItem label="Contato (usuario)" value={data.contactUser} />
          <ContainedLabelValueItem label="Contato (telefone)" value={data.contactTel} />
          <ContainedLabelValueItem label="Endereço" value={data.address} />
          <ContainedLabelValueItem label="Qnt. de subclientes" value={data.isLeaf} />
        </ContainedLabelValue>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
