"use client"

import {
  createBfleetClientEntity,
  ICreateBfleetClientEntityParams,
} from "@/@shared/actions/bwfleet-client-entity.actions";
import { IUseDisclosureHook, useDisclosure } from "@/@shared/hooks/use-disclosure";
import { authClient } from "@/@shared/lib/better-auth/auth-client";
import { BWFleetsProvider } from "@/@shared/provider/bwfleets";
import { generateFormData } from "@/@shared/utils/parse-form-data";
import { removeSpecialCharacters } from "@/@shared/utils/removeSpecialCharacters";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { addDays } from "date-fns";
import { useRouter } from "next/navigation";
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

export const userFormSchema = z.object({
	user: z.object({
		username: z.string().min(1, "Username de login não pode ser vazio"),
		password_creation_method: z.enum(["manual", "magic-link", "none"]),
		magic_link: z
			.object({
				pin: z.string().min(6, "PIN deve ter pelo menos 6 caracteres"),
			})
			.optional(),
		password: z.string().optional(),
		blocked: z.boolean().optional(),
	}),
})

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
  contacts: z
    .array(contactSchema)
    .optional()
    .default([]),
  address: z
		.object({
			cep: z.string().optional(),
			street: z.string().optional(),
			district: z.string().optional(),
			number: z.string().optional(),
			city: z.string().optional(),
			state: z.string().optional(),
			country: z.string().optional(),
		})
		.optional(),
  user: z.object({
    username: z.string().optional(),
    name: z.string().optional(),
    contact: z.string().optional(),
    email: z.string().optional(),
    password_creation_method: z.enum(["manual", "magic-link", "none"]),
    magic_link: z
      .object({
        pin: z.string().min(6, "PIN deve ter pelo menos 6 caracteres"),
      })
      .optional(),
    password: z.string().optional(),
    blocked: z.boolean().default(false),
  }),

  tenant: z.array(z.string()).optional(),
  enterprise_uuid: z.string().optional(),
  user_uuid: z.string().optional(),
});

export type UserFormData = z.infer<typeof userFormSchema>
export type ClientFormData = z.infer<typeof schema>

export type BWFleetCreateClientFormData = UserFormData & ClientFormData;

export type IUseCreateClientBwfleetResponse = {
  form: UseFormReturn<BWFleetCreateClientFormData>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  contactsFieldArray: UseFieldArrayReturn<
    BWFleetCreateClientFormData,
    "contacts"
  >;
  errors: FieldErrors<BWFleetCreateClientFormData>;
  handleMagicLinkClose: () => void;
  magicLinkDisclosure: IUseDisclosureHook<{
    magicLink: string;
    pin: string;
    name: string;
  }>
};

export const useCreateClientBwfleet = (): IUseCreateClientBwfleetResponse => {
  const { push } = useRouter()
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

  const magicLinkDisclosure = useDisclosure<{
      magicLink: string;
      pin: string;
      name: string;
  }>();

  const clearFields = () => {
    form.reset({
      name: "",
      document_type: "cnpj",
      document: "",
      contacts: [],
      address: {},
      user: {
        username: "",
        name: "",
        contact: "",
        email: "",
      },
    });
  };

  const handleSubmit = form.handleSubmit(
    async (data) => {
      const _BWFleetsProvider = new BWFleetsProvider();
      const valid = {
        date: addDays(new Date(), 60),
        days: 60,
      };

      const address = {
        cep: data.address?.cep && removeSpecialCharacters(data.address?.cep),
        city: data.address?.city,
        state: data.address?.state,
        district: data.address?.district,
        country: data.address?.country,
        street: data.address?.street,
        number: data.address?.number,
      };

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
        child_count: 0,
        contacts,
        depth: 2,
        document: {
          type: data.document_type,
          value: removeSpecialCharacters(data.document),
        },
        free_period: valid,
        validate: valid,
        user: {
          name: data.user.name,
          username: data.user.username,
          email: data.user.email,
          password_creation_method: data.user.password_creation_method,
          magic_link: data.user?.magic_link,
          password: data.user?.password,
          blocked: data.user.blocked,
        },
      };

      await _BWFleetsProvider
        .createOneClient({ data: clientPayload as any })
        .then(async ({ response }) => {
          const clientLocalEntity: ICreateBfleetClientEntityParams = {
            assigned_uuid: session?.user?.id ?? "",
            assigned_name: session?.user?.name ?? "",
            bwfleet: {
              username: clientPayload.user.username ?? null,  
              email: clientPayload.user.email ?? null,
              name: clientPayload.user.name ?? null,
              uuid: response.data.uuid,
            },
          };
          const formData = generateFormData(clientLocalEntity) as FormData;
          toast.success("Cliente criado com sucesso!");
          clearFields();
          createBfleetClientEntity(formData, false);
         
          if(data.user.password_creation_method === 'magic-link') {
            const token = response.data.user.magic_link?.token
            const url = `https://bwfleets.com/magic-link?token=${token}`
            return magicLinkDisclosure.onOpen({
              magicLink: url,
              pin: data.user.magic_link!.pin!,
              name: data.name,
            })
          }

          push('/bwfleets')
        })
        .catch((e) => {
          console.log({ e });
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
    },
    (err) => console.log({ err })
  );

  const errors = useMemo(() => form.formState.errors, [form.formState.errors]);

  function handleMagicLinkClose() {
    push('/bwfleets')
	}

  return {
    form,
    handleSubmit,
    contactsFieldArray,
    errors,
    magicLinkDisclosure,
    handleMagicLinkClose
  } as IUseCreateClientBwfleetResponse;
};
