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

export type ICreateScheduleBase = {
  scheduleSlotId: string
  notes?: string
  userId: string
  meeting_id?: string
  email: string
}
export interface ICreateScheduleWW extends ICreateScheduleBase {
  accountId: string
  wwt_account_id?: number
  clientId?: undefined
}
export interface ICreateScheduleBFleet extends ICreateScheduleBase {
  accountId?: undefined
  wwt_account_id?: undefined
  clientId: string
}

  

export type ICreateSchedule = ICreateScheduleWW | ICreateScheduleBFleet;

export async function createSchedule(params: ICreateSchedule) {
  console.log({ params })
  const client = await prisma.meeting.findFirst({
    where: {
      OR: [
        {
          accountId: params.accountId,
        },
        {
          clienteId: params.clientId
        }
      ],
      slot: {
        status: { in: ['BOOKED'] }
      }
    }
  })

  const slot = await prisma.scheduleSlot.findFirst({
    where: {
      id: params.scheduleSlotId,
      status: { in: ['BOOKED'] }
    }
  })

  if(slot) {
    throw new Error("Já possui um agendamento nesse horário")
  }

  if(client) {
    throw new Error("Esse cliente já possui um agendamento")
  }

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
        clienteId: params.clientId,
      },
      update: {
        accountId: params.accountId,
        description: params.notes,
        organizerId: params.userId,
        email: params.email,
        status: "BOOKED",
        slotId: params.scheduleSlotId,
        clienteId: params.clientId,
      }
    })
  })
  if(params.wwt_account_id) {
    revalidatePath(`/wwt/clients/${params.wwt_account_id}`);
  }

  revalidatePath('/meeting')
}