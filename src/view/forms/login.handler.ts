"use client";

import { signIn } from "@/@shared/actions/user.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});

type LoginFormData = z.infer<typeof formSchema>;

export function useLoginFormHandler() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
  });

  const handleAction: () => void = form.handleSubmit(
    handleSucceededSubmit,
    handleFailedSubmit
  );

  async function handleSucceededSubmit(data: LoginFormData) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      await signIn(formData);
    } catch (error) {
      console.error("error", error);
      toast.error("E-mail ou senha inválidos");
    }
  }

  async function handleFailedSubmit(error: FieldErrors<LoginFormData>) {
    console.error(error);
    toast.error("E-mail ou senha inválidos");
  }

  return {
    form,
    handleAction,
    handleSucceededSubmit,
    handleFailedSubmit,
  };
}
