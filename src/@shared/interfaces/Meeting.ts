import { Prisma } from "@prisma/client";

export type IMeeting = Prisma.MeetingGetPayload<{
  include: {
    account: true,
    organizer: true,
    slot: true,
    client: true,
  }
}>