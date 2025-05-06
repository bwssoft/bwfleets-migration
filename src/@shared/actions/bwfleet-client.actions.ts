"use server";

import { prisma } from "../lib/prisma/prisma-client";
import { BFleetClient } from "../interfaces/bfleet-client";
import { BFleetUser } from "../interfaces/bfleet-user";
import { parseFormData } from "../utils/parse-form-data";
import { Prisma } from "@prisma/client";
import { cleanObject } from "../utils/clean-object";

interface FindOneClientParams {
  where: Prisma.BFleetClientWhereInput;
}

export async function findOneBFleetClient(params: FindOneClientParams) {
  const { where } = params;
  return await prisma.bFleetClient.findFirstOrThrow({
    where,
  });
}

type UpsertBfleetClientParams = BFleetClient & {
  wwtAccountId: number;
};

export async function upsertBfleetClient(formData: FormData) {
  const data = parseFormData(formData, true) as UpsertBfleetClientParams;

  const client = cleanObject(data);

  const uuid = data.uuid ?? crypto.randomUUID();
  return await prisma.bFleetClient.upsert({
    create: {
      ...(client as any),
      uuid,
      wwtAccountId: data.wwtAccountId,
    },
    update: client,
    where: {
      uuid,
    },
  });
}

interface UpsertBfleetUserParams {
  name: string;
  email: string;
  contact: string;
  client: BFleetClient;
  user?: BFleetUser;
}

export async function upsertBfleetUser(formData: FormData) {
  const data = parseFormData(formData, true) as UpsertBfleetUserParams;

  const uuid = data.user?.uuid ?? crypto.randomUUID();

  const upsertData = {
    name: data.name,
    email: data.email,
    contact: data.contact,
  };

  const clientData = {
    uuid: data.client.uuid!,
    name: data.client.name,
  };

  const user = cleanObject(upsertData);

  return await prisma.bFleetUser.upsert({
    create: {
      ...(user as any),
      uuid,
      client: clientData,
    },
    update: {
      ...upsertData,
    },
    where: {
      uuid,
    },
  });
}
