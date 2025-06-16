"use client";

import { signIn } from "@/@shared/actions/user.actions";
import { BWFleetsProvider } from "@/@shared/provider/bwfleets";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
  const router = useRouter()

  const handleAction: () => void = form.handleSubmit(
    handleSucceededSubmit,
    handleFailedSubmit
  );

  async function handleSucceededSubmit(data: LoginFormData) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    const _BWFleetsProvider = new BWFleetsProvider();

    try {
      await signIn(formData).then(async () => {
        await _BWFleetsProvider.authenticate({
          email: "bws@bws.com",
          password: "123456@",
        }); 
        router.push("/home");
      });
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message !== "NEXT_REDIRECT") {
        toast.error("E-mail ou senha inválidos");
      }
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
