import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useQuery } from '@tanstack/react-query'
import { IScheduleSlot } from "@/@shared/interfaces/schedule-slot"
import { format, isSameDay } from "date-fns"
import { useCallback, useMemo, useState } from "react"
import { createSchedule } from "@/@shared/actions/schedule-slot.action"
import { authClient } from "@/@shared/lib/better-auth/auth-client"
import { IMeeting } from "@/@shared/interfaces/Meeting"
import { toast } from "sonner"


const schema = z.object({
  date: z.date({
    required_error: "Informe a data da reunião",
  }),
  time: z.string({
    required_error: 'Informe o horario da reunião'
  }),
  notes: z.string().optional()
})

export type IFetchSchedulesReply = {
  sucess: boolean
  data?: Array<IScheduleSlot>
  error?: string
}

export type IMeetingFormData = z.infer<typeof schema>;

export const useMeetingCard = ({ accountId, wwt_account_id }: {accountId: string, meeting?: IMeeting, wwt_account_id: number }) => {
  const { formState: { errors }, control, register, handleSubmit, watch, getValues, reset } = useForm<IMeetingFormData>({
    resolver: zodResolver(schema)
  })
  const [isModalOpen, setIsModalOpen] = useState(false)  

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

  const timeOptions: Array<IScheduleSlot> = useMemo(() => {
    const currentDate = getValues('date');
    if(!currentDate) return [];

    const schedulesDate = schedulesQuery.data?.data;
    const scheduleTimes = schedulesDate?.filter(({ start, status }) => {
      return (isSameDay(start, currentDate) && status === 'AVAILABLE') && new Date(start) >= new Date()
    });

    return scheduleTimes ?? []
  }, [watch('date')])

  const onHandleSubmit = handleSubmit(async (data) => {
    const { data: session } = await authClient.getSession();
    const userId = session?.user.id;
    if(!userId) return

    await createSchedule({
      notes: data.notes,
      scheduleSlotId: data.time,
      accountId: accountId,
      userId,
      wwt_account_id
    })

    onResetForm()
    setIsModalOpen(false)
    toast.success("Reunião agendada com sucesso")
  })

  const formatTime = ({ end, start }: Pick<IScheduleSlot, 'start' | 'end'>) => {
    const startTime = format(start, 'HH:mm');
    const endTime = format(end, 'HH:mm')
    return [startTime, endTime].join(' - ')
  }

  const onHandleCancel = () => {
    onResetForm()
    setIsModalOpen(false)
  }

  const onResetForm = () => {
    reset({
      date: undefined,
      notes: undefined,
      time: undefined
    })
  }


  return {
    register, 
    control,
    errors,
    onHandleSubmit,
    disabledData,
    disabledTime,
    timeOptions,
    formatTime,
    onHandleCancel,
    isModalOpen,
    setIsModalOpen
  }
}