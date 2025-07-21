'use server'
import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma/prisma-client";
import { ObjectId } from 'mongodb';

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
  wwt_account_id?: number
  meeting_id?: string
  email: string
}

export async function createSchedule(params: ICreateSchedule) {
  await prisma.$transaction(async (client) => {
    await client.scheduleSlot.update({
      where: {
        id: params.scheduleSlotId,
      },
      data: {
        status: 'BOOKED',
      }
    })

    await client.meeting.upsert({
      where: {
        id: params.meeting_id ?? new ObjectId().toHexString(),
      },
      create: {
        accountId: params.accountId,
        description: params.notes,
        organizerId: params.userId,
        email: params.email,
        status: "BOOKED",
        slotId: params.scheduleSlotId,
      },
      update: {
        accountId: params.accountId,
        description: params.notes,
        organizerId: params.userId,
        email: params.email,
        status: "BOOKED",
        slotId: params.scheduleSlotId,
      }
    })
  })
  if(params.wwt_account_id) {
    revalidatePath(`/wwt/clients/${params.wwt_account_id}`);
  }

  revalidatePath('/meeting')
}