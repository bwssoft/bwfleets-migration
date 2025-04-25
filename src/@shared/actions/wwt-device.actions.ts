import { Prisma } from "@prisma/client";
import { cleanObject } from "../utils/clean-object";
import { prisma } from "../lib/prisma/prisma-client";

interface FindManyDevicesParams {
  page?: number | null;
  pageSize?: number;
  where?: Prisma.deviceWhereInput;
  orderBy?: Prisma.deviceOrderByWithRelationInput[];
}

export async function findManyDevices(params: FindManyDevicesParams) {
  const { page, pageSize = 100, where, orderBy } = params;

  const formattedWhere = cleanObject(where);
  const formattedOrderBy = cleanObject(orderBy);

  const skip = !!page ? pageSize * Number(page - 1) : 0;

  const count = await prisma.device.count({
    where: formattedWhere,
  });

  const data = await prisma.device.findMany({
    skip,
    take: pageSize,
    where: formattedWhere,
    orderBy: formattedOrderBy as Prisma.deviceOrderByWithRelationInput[],
  });

  return {
    data,
    count,
  };
}
