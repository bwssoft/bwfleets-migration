/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { updateMigrationStatus } from "@/@shared/actions/wwt-client.actions";
import { WWTClient } from "@/@shared/interfaces/wwt-client";
import { Button } from "@/view/components/ui/button";
import { ArrowLeftRightIcon } from "lucide-react";
import { toast } from "sonner";

interface StartMigrationFormProps {
  client: WWTClient;
}

export function StartMigrationForm({ client }: StartMigrationFormProps) {
  async function handleAction() {
    try {
      const formData = new FormData();
      formData.append("uuid", client.id);
      formData.append("status", "in-progress");

      await updateMigrationStatus(formData);
    } catch (error: any) {
      toast.error("Não foi possível atualizar o status de migração", {
        description: error.message,
      });
    }
  }

  return (
    <form action={handleAction}>
      <Button type="submit">
        <ArrowLeftRightIcon /> Iniciar processo de migração
      </Button>
    </form>
  );
}
