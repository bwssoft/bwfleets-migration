'use client'

import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import React from "react";
import { z } from "zod";
import { meetingSearchParams } from "../params/meeting-search.params";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MeetingStatus } from "../tables/meeting.loader";
import { cleanObject } from "@/@shared/utils/clean-object";

const schema = z.object({
  clientName: z.string().optional(),
  status: z.enum(['pedding', 'completed', 'in-progress']).optional(),
  clientNameOrderBy: z.enum(["asc", "desc", "none"]).optional(),
  dateOrderBy: z.enum(["asc", "desc", "none"]).optional(),
})

export type SearchMeetingFormData = z.infer<typeof schema>;

export function useMeetingFormhandler() {
  const { refresh } = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const [searchParams, setSearchParams] = useQueryStates(meetingSearchParams, {
    history: "replace",
  });

  const form = useForm<SearchMeetingFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientName: searchParams.clientName ?? undefined,
      status: (searchParams.status as MeetingStatus) ?? undefined,
      clientNameOrderBy: (searchParams.clientNameOrderBy as never) ?? "none",
      dateOrderBy: (searchParams.dateOrderBy as never) ?? "desc",
    },
  });

   function handleSucceededSubmit(data: SearchMeetingFormData) {
    startTransition(() => {
      const queryStates = cleanObject(data);
      setSearchParams(queryStates).then(() => {
        refresh();
      });
    });
   }

   function handleClearFilters() {
    startTransition(() => {
      form.reset();
      setSearchParams({
        clientName: null,
        status: null,
        clientNameOrderBy: null,
        dateOrderBy: null,
      }).then(() => {
        refresh();
      });
    });
  }

  return {
    form,
    isPending,
    handleSucceededSubmit,
    handleClearFilters,
    searchParams,
  }
} 