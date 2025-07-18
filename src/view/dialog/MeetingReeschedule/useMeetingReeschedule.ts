'use client'

import { createSchedule } from "@/@shared/actions/schedule-slot.action";
import { IScheduleSlot } from "@/@shared/interfaces/schedule-slot";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { format, isSameDay } from "date-fns";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IFetchSchedulesReply } from "../MeetingDialog/useMeetingDialog";
import { IMeetingReescheduleProps } from ".";
import { toast } from "sonner";
import { authClient } from "@/@shared/lib/better-auth/auth-client";

const schema = z.object({
  meeting_id: z.string().optional(),
  date: z.date({
    required_error: "Informe a data da reunião",
  }),
  time: z.string({
    required_error: 'Informe o horario da reunião'
  }),
  notes: z.string().optional(),
  email: z.string({
    required_error: "Informe o e-mail do cliente"
  })
})

export type IMeetingFormData = z.infer<typeof schema>;


export const useMeetingReeschedule = ({ disclousure, accountId, meeting }: IMeetingReescheduleProps) => {
  const { formState: { errors }, control, register, handleSubmit, watch, getValues, reset } = useForm<IMeetingFormData>({
    resolver: zodResolver(schema),
  })

  const formatTime = ({ end, start }: Pick<IScheduleSlot, 'start' | 'end'>) => {
    const startTime = format(start, 'HH:mm');
    const endTime = format(end, 'HH:mm')
    return [startTime, endTime].join(' - ')
  }

  const fecthSchedules = async (): Promise<IFetchSchedulesReply> => {
    const response = await fetch('/api/meeting/find-schedules', {
      method: 'GET',
    })

    return await response.json()
  }

  const schedulesQuery = useQuery({
    queryKey: ['schedules'],
    queryFn: fecthSchedules
  });

  const timeOptions: Array<IScheduleSlot> = useMemo(() => {
    const currentDate = getValues('date');
    if(!currentDate) return [];

    const schedulesDate = schedulesQuery.data?.data;
    const scheduleTimes = schedulesDate?.filter(({ start, status }) => {
      return (isSameDay(start, currentDate) && status === 'AVAILABLE') && new Date(start) >= new Date()
    });

    return scheduleTimes ?? []
  }, [watch('date')])

  const disabledData = useCallback((date: Date): boolean => {
    if(date < new Date() && !isSameDay(date, new Date())) return true
    const schedulesDate = schedulesQuery.data?.data;
    const onSchedule = schedulesDate?.find(({ start, status }) => isSameDay(start, date) && status === 'AVAILABLE');
    return !onSchedule
  }, [schedulesQuery.data])

  const disabledTime = useMemo(() => {
      const currentDate = getValues('date');
      const disabled = !currentDate
      if(disabled) {
        reset({
          time: undefined
        });
      }
      return disabled
    }, [watch('date')])

  const onResetForm = () => {
    reset({
      date: undefined,
      notes: undefined,
      time: undefined
    })
  }

  const onHandleSubmit = handleSubmit(async (data) => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;
    if(!userId) return

    await createSchedule({
      notes: data.notes,
      scheduleSlotId: data.time,
      accountId: accountId!,
      userId,
      email: data.email,
      meeting_id: meeting?.id
    })

    onResetForm()
    disclousure.onClose()
    toast.success("Reunião agendada com sucesso")
  })

  const onHandleCancel = () => {
    onResetForm()
    disclousure.onClose()
  }

  return {
    register,
    control,
    onHandleSubmit,
    errors,
    formatTime,
    timeOptions,
    disabledTime,
    disabledData,
    onHandleCancel
  }
}