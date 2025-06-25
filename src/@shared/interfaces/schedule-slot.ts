import { Prisma } from "@prisma/client";

export type IScheduleSlot = Prisma.ScheduleSlotGetPayload<{
  include: {
    Meeting: {
      include: {
        id: true
        organizer: true,
        account: true
      }
    }
  }
}>;