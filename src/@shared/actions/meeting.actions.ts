import { Prisma } from "@prisma/client";
import { cleanObject } from "../utils/clean-object";
import { prisma } from "../lib/prisma/prisma-client";

interface FindManyMeetingParams {
  page?: number | null;
  pageSize?: number;
  where?: Prisma.MeetingWhereInput;
  orderBy?: Prisma.MeetingOrderByWithRelationInput[];
}

export async function findAllMeetings(params: FindManyMeetingParams) {
  const { page, pageSize = 100, where, orderBy } = params;
  const formattedWhere = cleanObject(where);
  const formattedOrderBy = cleanObject(orderBy);

  const skip = !!page ? pageSize * Number(page - 1) : 0;
  const count = await prisma.meeting.count({
    where: formattedWhere,
  });
  
  const data = await prisma.meeting.findMany({
    skip,
    take: pageSize,
    where: formattedWhere,
    include: {
      slot: true,
      account: true,
      organizer: true,
      client: true,
    },
    orderBy: formattedOrderBy as Prisma.MeetingOrderByWithRelationInput[],
  });

  return {
    data,
    count,
  }
}