import { prisma } from "@/lib/prisma/prisma-client";

export async function countClients() {
  return await prisma.client.count();
}
