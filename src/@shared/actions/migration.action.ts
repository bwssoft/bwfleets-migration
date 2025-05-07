import { MigrationStatus, Migration, BFleetClient, User } from "@prisma/client";
import { WWTClient } from "../interfaces/wwt-client";
import { prisma } from "../lib/prisma/prisma-client";
import { revalidatePath } from "next/cache";

interface StartMigration {
  wwtClient: WWTClient;
  status: MigrationStatus;
  migration?: Migration;
  bfleetClient?: BFleetClient;
  user: User;
}

export async function startMigration(data: StartMigration) {
  await prisma.migration.create({
    data: {
      uuid: crypto.randomUUID(),
      assigned_uuid: data.user.id,
      migration_status: data.status,
      wwt_account_id: data.wwtClient.accountId,
      bfleet_uuid: data.bfleetClient?.uuid ?? null,
    },
  });

  revalidatePath("/wwt/clients");
  revalidatePath(`/wwt/clients/${data.wwtClient.accountId}`);
}

interface UpdateMigrationStatus {
  uuid: string;
  status: MigrationStatus;
}

export async function updateMigrationStatus({
  status,
  uuid,
}: UpdateMigrationStatus) {
  return await prisma.migration.update({
    data: {
      migration_status: status,
    },
    where: {
      uuid,
    },
  });
}

interface WriteMigrationComment {
  message: string;
  wwt_account_uuid: string;
  user_uuid: string;
  migration_uuid: string;
}

export async function writeMigrationComment({
  message,
  wwt_account_uuid,
  migration_uuid,
  user_uuid,
}: WriteMigrationComment) {
  await prisma.comment.create({
    data: {
      uuid: crypto.randomUUID(),
      message,
      migration_uuid,
      user_uuid,
    },
  });

  revalidatePath(`/wwt/clients/${wwt_account_uuid}`);
}
