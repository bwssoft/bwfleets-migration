import { IWanwayClient } from "@/@shared/interfaces/wwt-client";
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
  wwtClient: IWanwayClient;
}

export function ClientStatisticsCard({ wwtClient }: ClientStatisticsCardProps) {
  return (
    <Card className="">
      <CardContent className="flex flex-col gap-2">
        <Alert>
          <Users2Icon />
          <AlertTitle>Subcontas</AlertTitle>
          <AlertDescription className="text-lg">
            {wwtClient.isLeaf}
          </AlertDescription>
        </Alert>

        <Separator className="my-2 " />

        <Alert>
          <TabletSmartphoneIcon />
          <AlertTitle>Total de dispositivos (dele e de subcontas)</AlertTitle>
          <AlertDescription className="text-lg">
            {wwtClient.accountStatsBean.deviceTotalNo}
          </AlertDescription>
        </Alert>
        <Alert>
          <SmartphoneIcon />
          <AlertTitle>Dispositivos proprios</AlertTitle>
          <AlertDescription className="text-lg">
            {wwtClient.accountStatsBean.deviceNo}
          </AlertDescription>
        </Alert>
        <Alert>
          <WifiIcon />
          <AlertTitle>Dispositivos dele online</AlertTitle>
          <AlertDescription className="text-lg">
            {wwtClient.accountStatsBean.onlineDeviceNo}
          </AlertDescription>
        </Alert>
        <Alert>
          <WifiOffIcon />
          <AlertTitle>Dispositivos dele offline</AlertTitle>
          <AlertDescription className="text-lg">
            {wwtClient.accountStatsBean.offlineDeviceNo}
          </AlertDescription>
        </Alert>
        <Alert>
          <PowerOffIcon />
          <AlertTitle>Dispositivos dele sem uso</AlertTitle>
          <AlertDescription className="text-lg">
            {wwtClient.accountStatsBean.unUsedDeviceNo}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
