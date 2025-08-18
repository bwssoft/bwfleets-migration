"use server";

import { prisma } from "../lib/prisma/prisma-client";

export async function findManyMigrationAudit() {
  const result = await prisma.migration.findMany({
    where: {
      migration_token: { isNot: null },
    },
  });
  const clients = await prisma.wanwayClient.findMany({
    where: {
      accountId: { in: result.map((i) => i.wwt_account_id) },
    },
  });
  return clients;
}
