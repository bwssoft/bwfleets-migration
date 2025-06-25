'use server'
import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma/prisma-client";

export async function FindAllScheduleSlot() {
  const schedules = await prisma.scheduleSlot.findMany({
    select: {
      start: true,
      end: true,
      status: true,
      id: true,
      createdAt: true,
      Meeting: {
        select: {
          id: true,
          organizer: true,
          account: {
            select: {
              email: true,
              accountName: true,
              userName: true,
              contactTel: true,
            }
          }
        }
      }
    }    
  });

  return schedules
}

export interface ICreateSchedule {
  scheduleSlotId: string
  notes?: string
  accountId: string
  userId: string
  wwt_account_id: number
}

export async function createSchedule(params: ICreateSchedule) {
  await prisma.$transaction(async (client) => {
    await client.scheduleSlot.update({
      where: {
        id: params.scheduleSlotId,
      },
      data: {
        status: 'BOOKED',
        Meeting: {
          create: {
            accountId: params.accountId,
            description: params.notes,
            organizerId: params.userId
          }
        }
      }
    })
  })

  revalidatePath(`/wwt/clients/${params.wwt_account_id}`);
}