import { WWTClient } from "@/@shared/interfaces/wwt-client";
import { Card, CardContent } from "@/view/components/ui/card";

import {
  PowerOffIcon,
  SmartphoneIcon,
  TabletSmartphoneIcon,
  Users2Icon,
  WifiIcon,
  WifiOffIcon,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/view/components/ui/alert";
import { Separator } from "@/view/components/ui/separator";
import React from "react";

interface ClientStatisticsCardProps {
  client: WWTClient;
}

export function ClientStatisticsCard({ client }: ClientStatisticsCardProps) {
  return (
    <Card className="sticky top-0">
      <CardContent className="flex flex-col gap-2">
        <Alert>
          <Users2Icon />
          <AlertTitle>Subcontas</AlertTitle>
          <AlertDescription className="text-lg">
            {client.isLeaf}
          </AlertDescription>
        </Alert>

        <Separator className="my-2 " />

        <Alert>
          <TabletSmartphoneIcon />
          <AlertTitle>Total de dispositivos (dele e de subcontas)</AlertTitle>
          <AlertDescription className="text-lg">
            {client.accountStatsBean.deviceTotalNo}
          </AlertDescription>
        </Alert>
        <Alert>
          <SmartphoneIcon />
          <AlertTitle>Dispositivos proprios</AlertTitle>
          <AlertDescription className="text-lg">
            {client.accountStatsBean.deviceNo}
          </AlertDescription>
        </Alert>
        <Alert>
          <WifiIcon />
          <AlertTitle>Dispositivos dele online</AlertTitle>
          <AlertDescription className="text-lg">
            {client.accountStatsBean.onlineDeviceNo}
          </AlertDescription>
        </Alert>
        <Alert>
          <WifiOffIcon />
          <AlertTitle>Dispositivos dele offline</AlertTitle>
          <AlertDescription className="text-lg">
            {client.accountStatsBean.offlineDeviceNo}
          </AlertDescription>
        </Alert>
        <Alert>
          <PowerOffIcon />
          <AlertTitle>Dispositivos dele sem uso</AlertTitle>
          <AlertDescription className="text-lg">
            {client.accountStatsBean.unUsedDeviceNo}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
