import { IScheduleSlot } from "@/@shared/interfaces/schedule-slot";
import { format, isSameDay } from "date-fns";
import { z } from "zod";
import { ICreateMeetingProps } from "./create-meeting.form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { IFetchSchedulesReply } from "../dialog/MeetingDialog/useMeetingDialog";
import { useCallback, useMemo } from "react";
import { authClient } from "@/@shared/lib/better-auth/auth-client";
import { createSchedule } from "@/@shared/actions/schedule-slot.action";
import { toast } from "sonner";

const schema = z.object({
    meeting_id: z.string().optional(),
    date: z.date({
        required_error: "Informe a data da reunião",
    }),
    time: z.string({
        required_error: "Informe o horario da reunião",
    }),
    notes: z.string().optional(),
    email: z.string({
        required_error: "Informe o e-mail do cliente",
    }),
});

export type IMeetingFormData = z.infer<typeof schema>;

export const useCreateMeetingFormHandler = ({
    data,
    onClose,
}: ICreateMeetingProps) => {
    const {
        formState: { errors },
        control,
        register,
        handleSubmit,
        watch,
        getValues,
        reset,
    } = useForm<IMeetingFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            meeting_id: data?.Meeting[0].id,
            email: data?.bwfleet.email ?? undefined,
        },
    });

    const fecthSchedules = async (): Promise<IFetchSchedulesReply> => {
        const response = await fetch("/api/meeting/find-schedules", {
            method: "GET",
        });

        return await response.json();
    };

    const schedulesQuery = useQuery({
        queryKey: ["schedules"],
        queryFn: fecthSchedules,
    });

    const disabledData = useCallback(
        (date: Date): boolean => {
            if (date < new Date() && !isSameDay(date, new Date())) return true;
            const schedulesDate = schedulesQuery.data?.data;
            const onSchedule = schedulesDate?.find(
                ({ start, status }) =>
                    isSameDay(start, date) && status === "AVAILABLE"
            );
            return !onSchedule;
        },
        [schedulesQuery.data]
    );

    const disabledTime = useMemo(() => {
        const currentDate = getValues("date");
        const disabled = !currentDate;
        if (disabled) {
            reset({
                time: undefined,
            });
        }
        return disabled;
    }, [watch("date")]);

    const timeOptions: Array<IScheduleSlot> = useMemo(() => {
        const currentDate = getValues("date");
        if (!currentDate) return [];

        const schedulesDate = schedulesQuery.data?.data;
        const scheduleTimes = schedulesDate?.filter(({ start, status }) => {
            return (
                isSameDay(start, currentDate) &&
                status === "AVAILABLE" &&
                new Date(start) >= new Date()
            );
        });

        return scheduleTimes ?? [];
    }, [watch("date")]);

    const formatTime = ({
        end,
        start,
    }: Pick<IScheduleSlot, "start" | "end">) => {
        const startTime = format(start, "HH:mm");
        const endTime = format(end, "HH:mm");
        return [startTime, endTime].join(" - ");
    };

    const onHandleCancel = () => {
        onClose();
        onResetForm();
    };

    const onResetForm = () => {
        reset({
            date: undefined,
            notes: undefined,
            time: undefined,
        });
    };

    const onHandleSubmit = handleSubmit(async (_data) => {
        try {
            const { data: session } = await authClient.getSession();
            const userId = session?.user.id;
            if (!userId || !data?.id) return;

            await createSchedule({
                notes: _data.notes,
                scheduleSlotId: _data.time,
                userId,
                email: _data.email,
                clientId: data.id,
                meeting_id: data?.Meeting[0].id,
            });

            onResetForm();
            onClose();
            toast.success("Reunião agendada com sucesso");
            // router.refresh()
        } catch (err: any) {
            toast.error(err.message);
            onResetForm();
        }
    });

    return {
        formatTime,
        onHandleCancel,
        onResetForm,
        register,
        control,
        timeOptions,
        disabledData,
        disabledTime,
        watch,
        errors,
        onHandleSubmit,
    };
};
