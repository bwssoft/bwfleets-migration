"use server";

import { MigrationStatusEnum } from "@/@shared/interfaces/wwt-client";
import { parseFormData } from "@/@shared/utils/parse-form-data";
import { prisma } from "@/lib/prisma/prisma-client";

interface Params {
  clientId: string;
  status: MigrationStatusEnum;
}

export async function updateMigrationStatusAction(formData: FormData) {
  const { clientId, status } = parseFormData<Params>(formData);

  return await prisma.client.update({
    data: {
      migrationStatus: status,
    },
    where: {
      id: clientId,
    },
  });
}
