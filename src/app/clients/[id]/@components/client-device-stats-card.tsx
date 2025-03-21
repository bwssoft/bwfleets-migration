import { WWTAccountStats } from "@/@shared/interfaces/wwt-client";
import { WWTClientDevicesStatsTable } from "@/components/table/wwt-client-devices-stats.table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface ClientDeviceStatsCardProps {
  data: WWTAccountStats[]
} 

export function ClientDeviceStatsCard(params: ClientDeviceStatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatisticas de dispositivos</CardTitle>
        <CardDescription>
          Quantidade de dispositivos referentes a este cliente, separados por:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WWTClientDevicesStatsTable {...params}  />
      </CardContent>
    </Card>
  );
}
