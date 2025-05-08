"use client";

import { IWanwayClient } from "@/@shared/interfaces";
import { getInitials } from "@/@shared/utils/get-initials";
import { Avatar, AvatarFallback } from "@/view/components/ui/avatar";
import React from "react";

interface ClientAssignedCardProps {
  wwtClient: IWanwayClient;
}

export function ClientAssignedCard({ wwtClient }: ClientAssignedCardProps) {
  const assigned = React.useMemo(() => {
    return wwtClient.migration?.assigned;
  }, [wwtClient]);

  if (!assigned) return null;

  return (
    <div className="flex gap-2 bg-card border border-border rounded-md p-4">
      <Avatar>
        <AvatarFallback>{getInitials(assigned.name)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <span className="text-xs mb-0  text-muted-foreground">Responsável</span>
        <span className="text-sm font-medium">
          {assigned.name} ({assigned.email})
        </span>
      </div>
    </div>
  );
}
