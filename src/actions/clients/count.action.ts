import { cleanObject } from "@/@shared/utils/clean-object";
import { prisma } from "@/lib/prisma/prisma-client";
import { Prisma } from "@prisma/client";

interface Params {
  where?: Prisma.clientWhereInput;
}

export async function countClients({ where }: Params) {
  const findManyWhere = cleanObject(where);
  return await prisma.client.count({
    where: findManyWhere,
  });
}
