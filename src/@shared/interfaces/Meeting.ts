import { Prisma } from "@prisma/client";

export type IMeeting = Prisma.MeetingGetPayload<{
  include: {
    slot: true
  }
}>