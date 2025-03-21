import { WWTClient } from "@/@shared/interfaces/wwt-client";
import { WWTClientTable } from "@/components/table/wwt-client.table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface ClientSubclientsCardProps {
  data: Array<WWTClient> 
}

export function ClientSubclientsCard(params: ClientSubclientsCardProps) {
  const { data } = params;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subclientes</CardTitle>
        <CardDescription>Clientes desse clientes encontrados</CardDescription>
      </CardHeader>
      <CardContent>
        <WWTClientTable data={data} />
      </CardContent>
    </Card>
  );
}
