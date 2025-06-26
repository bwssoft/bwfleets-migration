"use client";

import {
  upsertBfleetClient,
  upsertBfleetUser,
} from "@/@shared/actions/bwfleet-client.actions";
import { nanoid } from "nanoid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { generateFormData } from "@/@shared/utils/parse-form-data";
import { toast } from "sonner";
import { countries } from "@/@shared/constants/countries";
import { IBFleetClient, IWanwayClient } from "@/@shared/interfaces";
import { updateOneMigration } from "@/@shared/actions/migration.action";
import { useRouter } from "next/navigation";

const contactSchema = z.object({
  name: z.string().min(1, "Informe o nome de contato"),
  email: z.string().min(1, "Informe um e-mail válido de contato").email({
    message: "Informe um e-mail válido para contato",
  }),
  role: z.string().min(1, "informe a posição do cliente"),
  contact: z.string().min(1, "Informe o numero de contato"),
});

const schema = z.object({
  uuid: z.string().optional(),
  name: z.string().optional(),
  document_type: z.enum(["cpf", "cnpj"]).optional(),
  document: z.string().optional(),
  subdomain: z.string().optional(),

  contacts: z.array(contactSchema).default([]).optional(),
  country: z
    .object({
      name: z.string().optional(),
      code: z.string().optional(),
      altCode: z.string().optional(),
      numberCode: z.string().optional(),
    })
    .optional(),

  // freePeriod: z.number().nonnegative().optional(),

  // validate: z.number().nonnegative().optional(),

  district: z.string().optional(),
  number: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  cep: z.string().optional(),
  user: z
    .object({
      full_name: z.string().optional(),
      name: z.string().optional(),
      contact: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),

  tenant: z.array(z.string()).optional(),
  enterprise_uuid: z.string().optional(),
  user_uuid: z.string().optional(),
  // identifier: clientIdentifierSchema // VER OQ FAZER
});

export type BWFleetUpsertClientFormData = z.infer<typeof schema>;
export type BWFleetUpsertClientContactFieldArray = z.infer<
  typeof contactSchema
>;

interface UseUpsertBwfleetHandlerParams {
  wwtClient: IWanwayClient;
  bfleetClient: IBFleetClient | null;
}

export function useUpsertBwfleetHandler({
  wwtClient,
  bfleetClient,
}: UseUpsertBwfleetHandlerParams) {
  const { refresh } = useRouter();
  const form = useForm<BWFleetUpsertClientFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      uuid: bfleetClient?.uuid,
      enterprise_uuid: bfleetClient?.enterprise_uuid ?? undefined,
      subdomain: bfleetClient?.subdomain ?? undefined,
      tenant: bfleetClient?.tenant ?? [],
      name: bfleetClient?.name ?? wwtClient.userName,
      document: bfleetClient?.document?.value ?? undefined,
      document_type: bfleetClient?.document?.type as "cpf" | "cnpj",
      contacts: bfleetClient?.contacts ?? [],
      user_uuid: bfleetClient?.user_uuid ?? undefined,
      country: countries.find(
        (element) => element.name === bfleetClient?.address?.country
      ),
      cep: bfleetClient?.address?.cep ?? undefined,
      street: bfleetClient?.address?.street ?? undefined,
      district: bfleetClient?.address?.district ?? undefined,
      number: bfleetClient?.address?.number ?? undefined,
      city: bfleetClient?.address?.city ?? undefined,
      state: bfleetClient?.address?.state ?? undefined,
      user: {
        full_name: bfleetClient?.user?.full_name ?? undefined,
        name: bfleetClient?.user?.name ?? wwtClient.accountName,
        email: bfleetClient?.user?.email ?? undefined,
        contact: bfleetClient?.user?.contact ?? undefined,
      },
    },
  });

  const handleSubmit = form.handleSubmit(
    async (data: BWFleetUpsertClientFormData) => {
      if (!wwtClient.migration) {
        toast.error("Não encontramos uma migração para esse cliente");
        throw new Error("Não encontramos uma migração para esse cliente");
      }

      const address = {
        cep: data.cep,
        city: data.city,
        state: data.state,
        district: data.district,
        country: data.country?.name,
        street: data.street,
        number: data.number,
      };

      const document = {
        value: data.document,
        type: data.document_type,
      };

      const valid = {
        date: new Date(),
        days: 60,
      };

      const tenant =
        data.tenant && data.tenant?.length !== 0 ? data.tenant : [nanoid(21)];
      const enterprise_uuid =
        data.enterprise_uuid && data.enterprise_uuid?.length !== 0
          ? data.enterprise_uuid
          : crypto.randomUUID();
      const user_uuid =
        data.user_uuid && data.user_uuid?.length !== 0
          ? data.user_uuid
          : crypto.randomUUID();

      const clientPayload = generateFormData({
        uuid: data.uuid,
        name: data.name,
        address,
        subdomain: data.subdomain?.toLowerCase(),
        child_count: 0,
        contacts: data.contacts,
        depth: 1,
        document,
        profile_uuid: [],
        user_uuid,
        tenant,
        enterprise_uuid,
        created_at: new Date(),
        free_period: valid,
        validate: valid,
        restriction_uuid: crypto.randomUUID(),
        wwtAccountId: wwtClient.accountId,
      });

      const client = await upsertBfleetClient(clientPayload);

      const userPayload = {
        full_name: data.user?.full_name,
        name: data.user?.name,
        email: data.user?.email,
        contact: data.user?.contact,
        user: {
          uuid: user_uuid,
        },
      };

      if (Object.keys(userPayload).length !== 0) {
        await upsertBfleetUser(
          generateFormData({
            ...userPayload,
            client,
          })
        );
      }

      await updateOneMigration({
        uuid: wwtClient.migration.uuid,
        bfleet_client_uuid: data.uuid,
      });

      toast.success("Dados do cliente atualizados com sucesso!");
      refresh();
    },
    (errors: any) => {
      console.log("errors", errors);
    }
  );

  const contactsFieldArray = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  return {
    form,
    contactsFieldArray,
    handleSubmit,
  };
}
