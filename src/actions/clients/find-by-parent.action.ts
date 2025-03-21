import { prisma } from "@/lib/prisma/prisma-client";

export async function findByParentId(parentId: number) {
  return await prisma.client.findMany({
    where: {
      parentId
    }
  })
}