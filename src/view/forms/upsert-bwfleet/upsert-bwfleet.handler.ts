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
  name: z.string().min(1, "Nome da empresa não pode ser vazio").optional(),
  document_type: z.enum(["cpf", "cnpj"]).default("cnpj").optional(),
  document: z
    .string()
    .min(1, "Documento da empresa não pode ser vazio")
    .optional(),
  subdomain: z.string().optional(),
  contacts: z
    .array(contactSchema)
    .min(2, "Informe ao menos dois contatos")
    .default([])
    .optional(),
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
  cep: z
    .string({ required_error: "Código postal não pode ser vazio" })
    .min(1)
    .optional(),
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

  return {
    form,
  };
}
