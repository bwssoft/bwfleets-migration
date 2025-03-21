import { prisma } from "@/lib/prisma/prisma-client";

interface ListAllClientsParams {
  page?: number;
}

export async function listAllClients({ page = 1 }: ListAllClientsParams) {
  console.log("🚀 ~ listAllClients ~ page:", page);
  return await prisma.client.findMany({
    skip: 100 * Number(page),
    take: 100,
  });
}
