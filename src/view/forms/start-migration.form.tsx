/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  assignMigrationResponsibility,
  updateMigrationStatus,
} from "@/@shared/actions/wwt-client.actions";
import { WWTClient } from "@/@shared/interfaces/wwt-client";
import { authClient } from "@/@shared/lib/better-auth/auth-client";
import { Button } from "@/view/components/ui/button";
import { ArrowLeftRightIcon } from "lucide-react";
import { toast } from "sonner";

interface StartMigrationFormProps {
  client: WWTClient;
}

export function StartMigrationForm({ client }: StartMigrationFormProps) {
  const migrationStatus = client.migrationStatus;
  const { data } = authClient.useSession();

  async function handleAction() {
    if (!data) return;
    try {
      const formData = new FormData();
      formData.append("uuid", client.id);
      formData.append("status", "in-progress");
      await assignMigrationResponsibility({
        client_id: client.id,
        user_id: data.user.id!,
      });
      // Ítalo: Pelo o que eu entendi, a função 'assignMigrationResponsibility' já atualiza o status para "in-progress"
      // e não é mais necessário usar a função 'updateMigrationStatus'
      await updateMigrationStatus(formData);
    } catch (error: any) {
      toast.error("Não foi possível atualizar o status de migração", {
        description: error.message,
      });
    }
  }

  if (migrationStatus && migrationStatus !== "pending") {
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
