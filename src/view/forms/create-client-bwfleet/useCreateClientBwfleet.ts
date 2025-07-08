import {
  createBfleetClientEntity,
  ICreateBfleetClientEntityParams,
} from "@/@shared/actions/bwfleet-client-entity.actions";
import { authClient } from "@/@shared/lib/better-auth/auth-client";
import { BWFleetsProvider } from "@/@shared/provider/bwfleets";
import { generateFormData } from "@/@shared/utils/parse-form-data";
import { removeSpecialCharacters } from "@/@shared/utils/removeSpecialCharacters";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { addDays } from "date-fns";
import { useMemo } from "react";
import {
  FieldErrors,
  useFieldArray,
  UseFieldArrayReturn,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface UsecaseError {
  ok: boolean;
  error: {
    errors: {
      context: string;
      message: string;
      path: string;
    }[];
  };
}

const contactSchema = z.object({
  name: z.string().min(1, "Informe o nome de contato"),
  email: z.string().min(1, "Informe um e-mail válido de contato").email({
    message: "Informe um e-mail válido para contato",
  }),
  role: z.string().min(1, "informe a posição do cliente"),
  contact: z.string().min(1, "Informe o numero de contato"),
});

export const schema = z.object({
  uuid: z.string().optional(),
  name: z.string().min(1, "Informe o nome do cliente"),
  document_type: z
    .enum(["cpf", "cnpj"], {
      required_error: "Informe o tipo do documento",
      message: "O tipo informado não é valido",
    })
    .default("cnpj"),
  document: z
    .string({ required_error: "Informe o documento do cliente" })
    .min(1, "Informe o documento do cliente"),
  subdomain: z.string().nullable().optional(),
  contacts: z
    .array(contactSchema)
    .min(1, "Informe pelo menos um contato")
    .default([]),
  country: z.object(
    {
      name: z.string().optional(),
      code: z.string().optional(),
      altCode: z.string().optional(),
      numberCode: z.string().optional(),
    },
    {
      required_error: "Informe o país do cliente",
      invalid_type_error: "O país informado não é válido",
    }
  ),
  district: z
    .string({ required_error: "Informe o bairro do cliente" })
    .min(1, "Informe o bairro do cliente"),
  number: z
    .string({ required_error: "Informe o número do cliente" })
    .min(1, "Informe o número do cliente"),
  street: z
    .string({ required_error: "Informe a rua do cliente" })
    .min(1, "Informe a rua do cliente"),
  city: z
    .string({ required_error: "Informe a cidade do cliente" })
    .min(1, "Informe a cidade do cliente"),
  state: z
    .string({ required_error: "Informe o estado do cliente" })
    .min(1, "Informe o estado do cliente"),
  cep: z
    .string({ required_error: "Informe o CEP do cliente" })
    .min(1, "Informe o CEP do cliente"),
  user: z.object({
    full_name: z.string().optional(),
    name: z.string().min(1, "Informe o nome do usuário"),
    contact: z
      .string({ required_error: "Informe o número de contato do usuário" })
      .min(1, "Informe o número de contato do usuário"),
    email: z.string().email({
      message: "Informe um e-mail válido para o usuário",
    }),
  }),

  tenant: z.array(z.string()).optional(),
  enterprise_uuid: z.string().optional(),
  user_uuid: z.string().optional(),
});

export type BWFleetCreateClientFormData = z.infer<typeof schema>;

export type IUseCreateClientBwfleetResponse = {
  form: UseFormReturn<BWFleetCreateClientFormData>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  contactsFieldArray: UseFieldArrayReturn<
    BWFleetCreateClientFormData,
    "contacts"
  >;
  errors: FieldErrors<BWFleetCreateClientFormData>;
};

export const useCreateClientBwfleet = (): IUseCreateClientBwfleetResponse => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      document_type: "cnpj",
    },
  });
  const { data: session } = authClient.useSession();
  const contactsFieldArray = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  const clearFields = () => {
    form.reset({
      name: "",
      document_type: "cnpj",
      document: "",
      subdomain: null,
      contacts: [],
      country: undefined,
      district: "",
      number: "",
      street: "",
      city: "",
      state: "",
      cep: "",
      user: {
        full_name: "",
        name: "",
        contact: "",
        email: "",
      },
    });
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    const _BWFleetsProvider = new BWFleetsProvider();
    const valid = {
      date: addDays(new Date(), 60),
      days: 60,
    };

    const address = {
      cep: removeSpecialCharacters(data.cep),
      city: data.city,
      state: data.state,
      district: data.district,
      country: data.country?.name,
      street: data.street,
      number: data.number,
    };

    const subdomain =
      (data.subdomain?.length || 0) >= 1
        ? data.subdomain?.toLowerCase()
        : undefined;

    const contacts = data.contacts.map((contact) => {
      return {
        name: contact.name,
        email: contact.email,
        contact: removeSpecialCharacters(`+55 ${contact.contact}`),
      };
    });

    const clientPayload = {
      name: data.name,
      address,
      subdomain,
      child_count: 0,
      contacts,
      depth: 2,
      document: {
        type: data.document_type,
        value: removeSpecialCharacters(data.document),
      },
      profile_uuid: [],
      created_at: new Date(),
      free_period: valid,
      validate: valid,
      user: {
        name: data.user.name,
        email: data.user.email,
        contact: removeSpecialCharacters(`+55 ${data.user.contact}`),
      },
    };

    await _BWFleetsProvider
      .createOneClient({ data: clientPayload as any })
      .then(async ({ response }) => {
        const clientLocalEntity: ICreateBfleetClientEntityParams = {
          assigned_uuid: session?.user?.id ?? "",
          assigned_name: session?.user?.name ?? "",
          bwfleet: {
            email: clientPayload.user.email,
            name: clientPayload.name,
            uuid: response.data.uuid,
          },
        };
        const formData = generateFormData(clientLocalEntity) as FormData;
        toast.success("Cliente criado com sucesso!");
        clearFields();
        await createBfleetClientEntity(formData);
      })
      .catch((e) => {
        console.log({ e })
        if (e instanceof AxiosError) {
          const error = e as AxiosError<UsecaseError>;
          const errors = error.response?.data.error.errors ?? [];
          errors.forEach((e: any) => {
            if (e.context === "user") {
              form.setError(`${e.context}.${e.path}` as any, {
                message: e.message,
              });
              return;
            }
            form.setError(e.path, { message: e.message });
          });
        }
      });
  }, (err) => console.log({ err }));

  const errors = useMemo(() => form.formState.errors, [form.formState.errors]);

  return {
    form,
    handleSubmit,
    contactsFieldArray,
    errors,
  } as IUseCreateClientBwfleetResponse;
};
