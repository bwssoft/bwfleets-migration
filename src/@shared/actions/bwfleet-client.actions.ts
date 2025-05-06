/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "../lib/prisma/prisma-client";
import { BFleetClient } from "../interfaces/bfleet-client";

interface FindOneClientParams {
  where: any;
}

export async function findOneClient(params: FindOneClientParams) {
  const { where } = params;
  return await prisma.bFleetClient.findFirstOrThrow({
    where,
  });
}

export async function upsertBfleetClient(client: BFleetClient) {
  const uuid = client.uuid ?? crypto.randomUUID();
  return await prisma.bFleetClient.upsert({
    create: {
      ...client,
      uuid,
    },
    update: client,
    where: { uuid },
  });
}
