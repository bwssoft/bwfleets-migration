"use client";

import { FieldErrors, useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useQueryStates } from "nuqs";
import { cleanObject } from "@/@shared/utils/clean-object";
import { useRouter } from "next/navigation";
import { clientSearchParams } from "../params/clients-search.params";
import React, { ReactNode } from "react";
import { useDisclosure } from "@/@shared/hooks/use-disclosure";

import {
  CircleCheck,
  CircleDashed,
  CircleEllipsis,
  CircleX,
  UserRoundX,
} from "lucide-react";
import { MigrationStatus } from "@prisma/client";

const formSchema = z.object({
  name: z.string().optional(),
  login: z.string().optional(),
  devicesOrderBy: z.enum(["asc", "desc", "none"]).optional(),
  withSubclients: z.boolean().optional(),
  status: z.array(z.string()).optional(),
});

export const CLIENT_MIGRATION_STATUS_OPTIONS: Array<{ label: string, value: MigrationStatus, icon: ReactNode }> = [
  {
    label: "Pendente",
    value: "TO_DO",
    icon: <CircleDashed />,
  },
  {
    label: "Cliente inativo",
    value: "INACTIVE",
    icon: <UserRoundX />,
  },
  {
    label: "Em andamento",
    value: "PENDING",
    icon: <CircleEllipsis />,
  },
  {
    label: "Recusado",
    value: "FAILED_BY_CLIENT",
    icon: <CircleX />,
  },
  {
    label: "Finalizado",
    value: "DONE",
    icon: <CircleCheck />,
  },
];

export type SearchClientFormData = z.infer<typeof formSchema>;

export function useSearchClientFormHandler() {
  const filterDisclosure = useDisclosure();

  const [isPending, startTransition] = React.useTransition();

  const { refresh } = useRouter();

  const [searchParams, setSearchParams] = useQueryStates(clientSearchParams, {
    history: "replace",
  });

  const form = useForm<SearchClientFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      withSubclients: searchParams.withSubclients ?? false,
      devicesOrderBy: (searchParams.devicesOrderBy as never) ?? "none",
      login: searchParams.login ?? undefined,
      name: searchParams.name ?? undefined,
      status: searchParams.status ?? [],
    },
  });

  function handleSucceededSubmit(data: SearchClientFormData) {
    if (filterDisclosure.isOpen) {
      filterDisclosure.onClose();
    }

    startTransition(() => {
      const queryStates = cleanObject(data);
      setSearchParams(queryStates).then(() => {
        refresh();
      });
    });
  }

  function handleFailedSubmit(error: FieldErrors<SearchClientFormData>) {
    console.log("[search-client] validator error", error);
  }

  function handleClearFilters() {
    startTransition(() => {
      form.reset();
      setSearchParams({
        devicesOrderBy: null,
        login: null,
        name: null,
        status: null,
        withSubclients: null,
      }).then(() => {
        refresh();
      });
    });
  }

  return {
    form,
    isPending,
    handleSucceededSubmit,
    handleFailedSubmit,
    filterDisclosure,
    searchParams,
    handleClearFilters,
  };
}
