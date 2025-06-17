'use client';

import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import { cleanObject } from "@/@shared/utils/clean-object";
import { bfleetClientSearchParams } from "../params/bfleet-client-search.params";

const schema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  nameOrderBy: z.enum(["asc", "desc", "none"]).optional(),
})

export type SearchBFleetClientFormData = z.infer<typeof schema>;

export function useBfleetClientFormHandler() {
const { refresh } = useRouter();

const [isPending, startTransition] = React.useTransition();

  const [searchParams, setSearchParams] = useQueryStates(bfleetClientSearchParams, {
    history: "replace",
  });

  const form = useForm<SearchBFleetClientFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: searchParams.email ?? undefined,
      name: searchParams.name ?? undefined,
      nameOrderBy: (searchParams.nameOrderBy as never) ?? "none",
    },
  });

  function handleSucceededSubmit(data: SearchBFleetClientFormData) {
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
        name: null,
        email: null,
        nameOrderBy: null,
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