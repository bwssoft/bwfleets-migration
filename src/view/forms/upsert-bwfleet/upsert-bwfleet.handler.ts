import {
  upsertBfleetClient,
  upsertBfleetUser,
} from "@/@shared/actions/bwfleet-client.actions";
import { nanoid } from "nanoid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { generateFormData } from "@/@shared/utils/parse-form-data";
import { WWTClient } from "@/@shared/interfaces/wwt-client";

const contactSchema = z.object({
  name: z.string().min(1, "Informe o nome de contato"),
  email: z.string().min(1, "Informe o email de contato").email({
    message: "Informe um email valido para contato",
  }),
  contact: z.string().min(1, "Informe o numero de contato"),
});

const schema = z.object({
  uuid: z.string().optional(),
  name: z.string().min(1, "Nome da empresa não pode ser vazio").optional(),
  document_type: z.enum(["cpf", "cnpj"]).optional(),
  document: z.string().optional(),
  subdomain: z.string().optional(),

  contacts: z.array(contactSchema).default([]).optional(),
  country: z
    .string()
    // .array(
    //   z.object({
    //     name: z.string().optional(),
    //     code: z.string().optional(),
    //     altCode: z.string().optional(),
    //     numberCode: z.string().optional(),
    //   })
    // )
    .optional(),

  freePeriod: z.number().nonnegative().optional(),

  validate: z.number().nonnegative().optional(),

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
      name: z.string().min(1, "Nome do usuário não pode ser vazio").optional(),
      contact: z
        .string({
          required_error: "Numero de telefone do usuario não pode ser vazio",
        })
        .optional(),
      email: z.string().optional(),
    })
    .optional(),
  // identifier: clientIdentifierSchema // VER OQ FAZER
});

export type BWFleetUpsertClientFormData = z.infer<typeof schema>;

interface UseUpsertBwfleetHandlerParams {
  wwtClient: WWTClient;
}

export function useUpsertBwfleetHandler({
  wwtClient,
}: UseUpsertBwfleetHandlerParams) {
  const form = useForm<BWFleetUpsertClientFormData>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit(
    async (data) => {
      const address = {
        cep: data.cep,
        city: data.city,
        state: data.state,
        district: data.district,
        country: data.country,
        street: data.street,
        number: data.street,
      };

      const document = {
        value: data.document,
        type: data.document_type,
      };

      const valid = {
        date: new Date(),
        days: 60,
      };

      const tenant = [nanoid(21)];
      const enterprise_uuid = crypto.randomUUID();

      const clientPayload = generateFormData({
        uuid: data.uuid,
        name: data.name,
        address,
        subdomain: data.subdomain,
        child_count: 0,
        contacts: [],
        depth: 1,
        document,
        profile_uuid: [],
        user_uuid: crypto.randomUUID(),
        tenant,
        enterprise_uuid,
        created_at: new Date(),
        free_period: valid,
        validate: valid,
        restriction_uuid: crypto.randomUUID(),
        wwtAccountId: wwtClient.accountId,
      });

      const client = await upsertBfleetClient(clientPayload);

      const userPayload = generateFormData({
        name: data.user?.name,
        email: data.user?.email,
        contact: data.user?.contact,
        client,
      });

      await upsertBfleetUser(userPayload);
    },
    (error) => {
      console.log("🚀 ~ handleSubmit ~ error:", error);
    }
  );

  return {
    form,
    handleSubmit,
  };
}
