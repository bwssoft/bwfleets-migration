"use server";

import { Migration, MigrationAccessToken, MigrationStatus } from "@prisma/client";
import { prisma } from "../lib/prisma/prisma-client";
import { revalidatePath } from "next/cache";
import { User } from "better-auth";
import { IBFleetClient, IWanwayClient } from "../interfaces";

interface StartMigration {
  wwtClient: IWanwayClient;
  status: MigrationStatus;
  bfleetClient?: IBFleetClient;
  user: User;
}

export async function startMigration(data: StartMigration) {
  const currentMigration = await prisma.migration.findFirst({
    where: {
      wwt_account_id: data.wwtClient.accountId,
    },
  });

  if (currentMigration) {
    throw new Error("Uma migração para esse cliente já foi iniciada");
  }

  await prisma.migration.create({
    data: {
      uuid: crypto.randomUUID(),
      assigned_uuid: data.user.id,
      migration_status: data.status,
      wwt_account_id: data.wwtClient.accountId,
      bfleet_client_uuid: data.bfleetClient?.uuid ?? null,
    },
  });

  revalidatePath("/wwt/clients");
  revalidatePath(`/wwt/clients/${data.wwtClient.accountId}`);
}

interface UpdateMigrationStatus {
  uuid: string;
  status: MigrationStatus;
  token?: string
  bfleet_uuid?: string
}

export async function updateMigrationStatus({
  status,
  uuid,
  token,
  bfleet_uuid
}: UpdateMigrationStatus) {
  let migration_token = undefined as MigrationAccessToken | undefined;

  if(token && bfleet_uuid) {
    migration_token = {
      token,
      created_at: new Date(),
      bfleet_uuid
    }
  }

  return await prisma.migration.update({
    data: {
      migration_status: status,
      ...{ migration_token }
    },
    where: {
      uuid,
    },
  });
}

export interface WriteMigrationComment {
  message: string;
  wwt_account_id: number;
  user_uuid: string;
  migration_uuid: string;
}

export async function writeMigrationComment({
  message,
  wwt_account_id,
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

  revalidatePath(`/wwt/clients/${wwt_account_id}`);
}

interface UpdateOneMigration extends Partial<Migration> {
  uuid: string;
}

export async function updateOneMigration(data: UpdateOneMigration) {
  await prisma.migration.update({
    data: {
      ...data,
    },
    where: {
      uuid: data.uuid,
    },
  });
}
