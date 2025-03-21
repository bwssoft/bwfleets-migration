import { prisma } from "@/lib/prisma/prisma-client";

export async function findOneClient(accountId: number) {
  return await prisma.client.findFirstOrThrow({
    where: {
      accountId,
    },
  });
}
