import { cleanObject } from "@/@shared/utils/clean-object";
import { prisma } from "@/lib/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { countClients } from "./count.action";

interface ListAllClientsParams {
  page?: number;
  where?: Prisma.clientWhereInput;
  orderBy?: Prisma.clientOrderByWithAggregationInput;
}

export async function listAllClients({
  page,
  where,
  orderBy,
}: ListAllClientsParams) {
  const findManyWhere = cleanObject(where);
  const skip = !!page ? 100 * Number(page - 1) : 0;

  const totalClients = await countClients({
    where: findManyWhere,
  });

  const data = await prisma.client.findMany({
    skip,
    take: 100,
    where: findManyWhere,
    orderBy,
  });

  return {
    count: totalClients,
    data,
  };
}
