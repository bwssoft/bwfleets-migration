import { findAllMeetings } from "@/@shared/actions/meeting.actions";
import { IMeetingPageParams } from "@/app/(auth)/meeting/params";
import { Prisma } from "@prisma/client";
import { MeetingTable } from "./meeting.table";
import { setHours } from "date-fns";

export interface MeetingTableLoaderProps {
  params: IMeetingPageParams
}

export type MeetingStatus = 'pedding' | 'completed' | 'in-progress'

export async function MeetingLoader({ params }: MeetingTableLoaderProps) {

  const buildTimeClause = (): Prisma.MeetingWhereInput => {
    const status:  MeetingStatus | null = params.status as MeetingStatus;
    
    if(!status) return {}

    if(status === 'pedding') {
      return {
        slot: {
          start: {
            gt: new Date()
          }
        }
      }
    }
    
    if(status === 'completed') {
      return {
        slot: {
          end: {
            lt: new Date()
          }
        }
      }
    }

    return {
      slot: {
        AND: [
          {
            end: {
          gte: new Date()
        },
        
          },
           {
            start: {
          lte: new Date()
        }
           }
        ]
      }
    }
  }


  const { count, data } = await findAllMeetings({
    page: params.page,
    where: {
      account: {
        userName: {
          contains: params?.clientName as string,
          mode: 'insensitive'
        }
      },
      ...buildTimeClause(),
    },
    orderBy: [
      {
        account: {
          userName: params.clientNameOrderBy !== 'none' ? (params.clientNameOrderBy as never) : undefined,
        }
      }
    ]
  })

  return (
    <MeetingTable 
      data={data}
      pagination={{
        count,
        pageSize: 20,
      }}
    />
  )
}