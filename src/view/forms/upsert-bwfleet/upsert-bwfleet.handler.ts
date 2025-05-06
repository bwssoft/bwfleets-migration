import { upsertBfleetClient } from "@/@shared/actions/bwfleet-client.actions";
import { nanoid } from "nanoid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Informe o nome de contato"),
  email: z.string().min(1, "Informe o email de contato").email({
    message: "Informe um email valido para contato",
  }),
  contact: z.string().min(1, "Informe o numero de contato"),
});

const schema = z.object({
  uuid: z.string().optional(),
  name: z.string().min(1, "Nome da empresa não pode ser vazio"),
  document_type: z.enum(["cpf", "cnpj"]),
  document: z.string(),
  subdomain: z.string(),

  contacts: z.array(contactSchema).default([]).optional(),
  country: z
    .array(
      z.object({
        name: z.string(),
        code: z.string(),
        altCode: z.string(),
        numberCode: z.string(),
      }),
      { required_error: "País não pode ser vazio" }
    )
    .min(1)
    .optional(),

  freePeriod: z.number().nonnegative().optional(),

  validate: z.number().nonnegative().optional(),

  district: z.string().min(1, "Endereço não pode ser vazio").optional(),
  number: z.string().min(1, "Endereço não pode ser vazio").optional(),
  street: z.string().min(1, "Endereço não pode ser vazio").optional(),
  city: z.string().min(1, "Cidade não pode ser vazio").optional(),
  state: z.string().min(1, "Estado não pode ser vazio").optional(),
  cep: z.string({ required_error: "Código postal não pode ser vazio" }),
  user: z
    .object({
      name: z.string().min(1, "Nome do usuário não pode ser vazio").optional(),
      contact: z
        .string({
          required_error: "Numero de telefone do usuario não pode ser vazio",
        })
        .min(1)
        .optional(),
      email: z
        .string()
        .min(1, "Nome do usuário não pode ser vazio")
        .email("E-mail precisa estar em um formato valido")
        .optional(),
    })
    .optional(),
  // identifier: clientIdentifierSchema // VER OQ FAZER
});

export type BWFleetUpsertClientFormData = z.infer<typeof schema>;

export function useUpsertBwfleetHandler() {
  const form = useForm<BWFleetUpsertClientFormData>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const address = {
      cep: data.cep,
      city: data.city,
      state: data.state,
      district: data.district,
      country: data.country?.[0]?.name,
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

    await upsertBfleetClient({
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
    });
  });

  return {
    form,
    handleSubmit,
  };
}
