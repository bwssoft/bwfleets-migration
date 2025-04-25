"use client";

import { setFirstAccessPassword } from "@/@shared/actions/user.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password !== data.confirmPassword, {
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
    formData.append(
      "body",
      JSON.stringify({
        password: data.password,
      })
    );
    await setFirstAccessPassword(formData);
  }

  return {
    form,
    handleAction,
  };
}
