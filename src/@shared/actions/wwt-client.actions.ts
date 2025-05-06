/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cleanObject } from "../utils/clean-object";
import { prisma } from "../lib/prisma/prisma-client";
import { MigrationStatusEnum } from "../interfaces/wwt-client";
import { parseFormData } from "../utils/parse-form-data";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

interface FindManyClientsParams {
  page?: number | null;
  pageSize?: number;
  where?: Prisma.clientWhereInput;
  orderBy?: Prisma.clientOrderByWithRelationInput[];
}

export async function findManyClients(params: FindManyClientsParams) {
  const { page, pageSize = 100, where, orderBy } = params;

  const formattedWhere = cleanObject(where);
  const formattedOrderBy = cleanObject(orderBy);

  const skip = !!page ? pageSize * Number(page - 1) : 0;

  const count = await prisma.client.count({
    where: formattedWhere,
  });

  const data = await prisma.client.findMany({
    skip,
    take: pageSize,
    where: formattedWhere,
    orderBy: formattedOrderBy as Prisma.clientOrderByWithRelationInput[],
    select: {
      id: true,
      userName: true,
      accountName: true,
      accountStatsBean: true,
      accountId: true,
      email: true,
      isLeaf: true,
      migrationStatus: true,
      assigned: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return {
    data,
    count,
  };
}

interface FindOneClientParams {
  where: any;
}

export async function findOneClient(params: FindOneClientParams) {
  const { where } = params;
  return await prisma.client.findFirstOrThrow({
    where,
  });
}

interface UpdateMigrationStatus {
  uuid: string;
  status: MigrationStatusEnum;
}

export async function updateMigrationStatus(formData: FormData) {
  const { uuid, status } = parseFormData(formData) as UpdateMigrationStatus;

  return await prisma.client.update({
    data: {
      migrationStatus: status,
    },
    where: {
      id: uuid,
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AssignMigrationResponsibility {
  export type Params = {
    client_id: string;
    user_id: string;
  };
}

export async function assignMigrationResponsibility(
  params: AssignMigrationResponsibility.Params
) {
  const { client_id, user_id } = params;

  await prisma.client.update({
    where: {
      id: client_id,
    },
    data: {
      assignedId: user_id,
      migrationStatus: "in-progress",
    },
  });
  revalidatePath("/wwt/clients");
}
