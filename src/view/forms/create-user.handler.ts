"use client";

import { createUser } from "@/@shared/actions/user.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  role: z.enum(["comercial", "support", "admin"]),
});

type CreateUserFormData = z.infer<typeof formSchema>;

export function useCreateUserFormHandler() {
  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "comercial",
    },
  });

  const handleAction: () => void = form.handleSubmit(
    handleSucceededSubmit,
    handleFailedSubmit
  );

  async function handleSucceededSubmit(data: CreateUserFormData) {
    const formData = new FormData();
    formData.append("body", JSON.stringify(data));
    await createUser(formData);
  }

  function handleFailedSubmit(error: FieldErrors<CreateUserFormData>) {
    console.error(JSON.stringify(error));
    toast.error("Não foi possível registrar esse usuário", {
      description: JSON.stringify(error),
    });
  }

  return {
    form,
    handleSucceededSubmit,
    handleFailedSubmit,
    handleAction,
  };
}
