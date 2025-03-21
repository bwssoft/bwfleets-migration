import { WWTClientTable } from "@/components/table/wwt-client.table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ClientSubclientsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subclientes</CardTitle>
        <CardDescription>Clientes desse clientes encontrados</CardDescription>
      </CardHeader>
      <CardContent>
        <WWTClientTable data={[]} />
      </CardContent>
    </Card>
  );
}
