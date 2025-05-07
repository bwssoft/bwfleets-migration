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
import { WWTClient } from "@/@shared/interfaces/wwt-client";
import { cleanObject } from "@/@shared/utils/clean-object";
import { BFleetClient, BFleetUser } from "@prisma/client";
import { toast } from "sonner";
import { countries } from "@/@shared/constants/countries";

const contactSchema = z.object({
  name: z.string().min(1, "Informe o nome de contato"),
  email: z.string().min(1, "Informe um e-mail válido de contato").email({
    message: "Informe um e-mail válido para contato",
  }),
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
  cep: z
    .string({ required_error: "Código postal não pode ser vazio" })
    .optional(),
  user: z
    .object({
      name: z.string().optional(),
      contact: z.string().optional(),
      email: z
        .string()
        .email({ message: "Insira um e-mail válido" })
        .optional(),
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
  wwtClient: WWTClient;
  bfleetClient: (BFleetClient & { user: BFleetUser }) | null;
}

export function useUpsertBwfleetHandler({
  wwtClient,
  bfleetClient,
}: UseUpsertBwfleetHandlerParams) {
  const form = useForm<BWFleetUpsertClientFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      uuid: bfleetClient?.uuid,
      enterprise_uuid: bfleetClient?.enterprise_uuid ?? "",
      subdomain: bfleetClient?.subdomain ?? "",
      tenant: bfleetClient?.tenant ?? [],
      name: bfleetClient?.name ?? wwtClient.userName,
      document: bfleetClient?.document?.value,
      document_type: bfleetClient?.document?.type as "cpf" | "cnpj",
      contacts: bfleetClient?.contacts ?? [],
      user_uuid: bfleetClient?.user_uuid ?? "",
      country: countries.find(
        (element) => element.name === bfleetClient?.address?.country
      ),
      cep: bfleetClient?.address?.cep ?? "",
      street: bfleetClient?.address?.street ?? "",
      district: bfleetClient?.address?.district ?? "",
      number: bfleetClient?.address?.number ?? "",
      city: bfleetClient?.address?.city ?? "",
      state: bfleetClient?.address?.state ?? "",
      user: {
        name: bfleetClient?.user?.name ?? "",
        email: bfleetClient?.user?.email ?? "",
        contact: bfleetClient?.user?.contact ?? "",
      },
    },
  });

  const handleSubmit = form.handleSubmit(
    async (data: BWFleetUpsertClientFormData) => {
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

      const tenant = data.tenant?.length !== 0 ? data.tenant : [nanoid(21)];
      const enterprise_uuid =
        data.enterprise_uuid?.length !== 0
          ? data.enterprise_uuid
          : crypto.randomUUID();
      const user_uuid =
        data.user_uuid?.length !== 0 ? data.user_uuid : crypto.randomUUID();
      console.log("🚀 ~ user_uuid:", user_uuid);

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

      const userPayload = cleanObject({
        name: data.user?.name,
        email: data.user?.email,
        contact: data.user?.contact,
        user: {
          uuid: user_uuid,
        },
      });

      if (Object.keys(userPayload).length !== 0) {
        await upsertBfleetUser(
          generateFormData({
            ...userPayload,
            client,
          })
        );
      }

      toast.success("Dados do cliente atualizados com sucesso!");
    },
    (error) => {
      console.log("🚀 ~ handleSubmit ~ error:", error, form.getValues());
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
