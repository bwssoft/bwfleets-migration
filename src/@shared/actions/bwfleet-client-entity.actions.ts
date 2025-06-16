'use server';
import { BFleetClientEntity, Prisma } from "@prisma/client";
import { parseFormData } from "../utils/parse-form-data";
import { prisma } from "../lib/prisma/prisma-client";
import { cleanObject } from "../utils/clean-object";


export type ICreateBfleetClientEntityParams = Omit<BFleetClientEntity, 'id'>;

export async function createBfleetClientEntity(
  formData: FormData,
) {
  const data = parseFormData(formData, true) as ICreateBfleetClientEntityParams;

  const uuid = crypto.randomUUID();

  return await prisma.bFleetClientEntity.create({
    data: {
      id: uuid,
      ...data,
    }
  });
}

interface FindManyBClientsParams {
  page?: number | null;
  pageSize?: number;
  where?: Prisma.BFleetClientEntityWhereInput;
  orderBy?: Prisma.BFleetClientEntityOrderByWithRelationInput[];
}

export async function findBwfleetClientEntity(params: FindManyBClientsParams) {
  const { page, pageSize = 100, where, orderBy } = params;

  const formattedWhere = cleanObject(where);
  const formattedOrderBy = cleanObject(orderBy);

  const skip = !!page ? pageSize * Number(page - 1) : 0;

  const count = await prisma.bFleetClientEntity.count({
    where: formattedWhere,
  });

  const data = await prisma.bFleetClientEntity.findMany({
    skip,
    take: pageSize,
    where: formattedWhere,
    orderBy: formattedOrderBy as Prisma.WanwayClientOrderByWithRelationInput[],
    include: {
      migration: {
        include: {
          assigned: true,
          comments: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  return {
    data,
    count,
  }
}