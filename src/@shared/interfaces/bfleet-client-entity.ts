import { Prisma } from "@prisma/client";

export type IBfleetClientEntity = Prisma.BFleetClientEntityGetPayload<{
  include: {
    Meeting: {
      include: {
        slot: true
      }
    }
  }
}>