/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { startMigration } from "@/@shared/actions/migration.action";
import { IWanwayClient, IBFleetClient } from "@/@shared/interfaces";
import { authClient } from "@/@shared/lib/better-auth/auth-client";
import { Button } from "@/view/components/ui/button";
import { ArrowLeftRightIcon } from "lucide-react";
import { toast } from "sonner";

interface StartMigrationFormProps {
  wwtClient: IWanwayClient;
  bfleetClient?: IBFleetClient;
}

export function StartMigrationForm({
  wwtClient,
  bfleetClient,
}: StartMigrationFormProps) {
  const migrationStatus = wwtClient.migration?.migration_status ?? "TO_DO";
  const { data } = authClient.useSession();

  async function handleAction() {
    if (!data) return;
    try {
      const formData = new FormData();
      formData.append("uuid", wwtClient.id);
      formData.append("status", "PENDING");

      await startMigration({
        status: "PENDING",
        user: data.user,
        wwtClient,
        bfleetClient,
      });
    } catch (error: any) {
      toast.error("Não foi possível atualizar o status de migração", {
        description: error.message,
      });
    }
  }

  if (migrationStatus && migrationStatus !== "TO_DO") {
    return null;
  }

  return (
    <form action={handleAction}>
      <Button type="submit">
        <ArrowLeftRightIcon /> Iniciar processo de migração
      </Button>
    </form>
  );
}
