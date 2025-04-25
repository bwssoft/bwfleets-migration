"use client";

import { setFirstAccessPassword } from "@/@shared/actions/user.actions";
import { authClient } from "@/@shared/lib/better-auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

type FirstAccessFormData = z.infer<typeof formSchema>;

export function useFirstAccessFormHandler() {
  const form = useForm<FirstAccessFormData>({
    resolver: zodResolver(formSchema),
  });

  const handleAction: () => void = form.handleSubmit(handleSucceededSubmit);

  async function handleSucceededSubmit(data: FirstAccessFormData) {
    const formData = new FormData();

    const session = await authClient.getSession();

    if (session.error) {
      throw new Error(session.error as never);
    }

    formData.append(
      "body",
      JSON.stringify({
        password: data.password,
        id: session.data.user.id,
      })
    );

    await setFirstAccessPassword(formData);
  }

  return {
    form,
    handleAction,
  };
}
