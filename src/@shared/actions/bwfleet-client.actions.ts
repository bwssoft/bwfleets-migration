"use server";

import { prisma } from "../lib/prisma/prisma-client";
import { BFleetUser } from "../interfaces/bfleet-user";
import { parseFormData } from "../utils/parse-form-data";
import { Prisma, BFleetClient } from "@prisma/client";
import { cleanObject } from "../utils/clean-object";

interface FindOneClientParams {
  where: Prisma.BFleetClientWhereInput;
  include?: Prisma.BFleetClientInclude;
}

export async function findOneBFleetClient(params: FindOneClientParams) {
  const { where, include } = params;
  return await prisma.bFleetClient.findFirst({
    where,
    include,
  });
}

type UpsertBfleetClientParams = BFleetClient & {
  wwtAccountId: number;
};

export async function upsertBfleetClient(formData: FormData) {
  const data = parseFormData(formData, true) as UpsertBfleetClientParams;

  const client = data;

  const uuid = data.uuid ?? crypto.randomUUID();
  return await prisma.bFleetClient.upsert({
    create: {
      ...(client as Prisma.BFleetClientCreateInput),
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
  full_name: string;
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
    full_name: data.full_name,
  };

  const clientData = {
    uuid: data.client.uuid!,
    name: data.client.name!,
  };

  const user = cleanObject(upsertData);

  return await prisma.bFleetUser.upsert({
    create: {
      ...(user as Prisma.BFleetUserCreateInput),
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
