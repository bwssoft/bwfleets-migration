import { prisma } from "@/lib/prisma/prisma-client";

export async function findByAccountId(accountId: number) {
  return await prisma.device.findMany({
    // @ts-ignore
    where: { ownerBean: { accountId  } }
  })
}