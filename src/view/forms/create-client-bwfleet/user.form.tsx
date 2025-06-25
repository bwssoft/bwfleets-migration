import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/view/components/ui/card";
import { Input } from "@/view/components/ui/input";
import { Controller, FieldErrors, UseFormReturn } from "react-hook-form";
import { InputWithMask } from "@/view/components/ui/input-with-mask";
import { BWFleetCreateClientFormData } from "./useCreateClientBwfleet";

interface UserFormProps {
  form: UseFormReturn<BWFleetCreateClientFormData>;
  errors: FieldErrors<BWFleetCreateClientFormData>;
}

export function UserForm({ form, errors }: UserFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuário</CardTitle>
        <CardDescription>
          Dados referentes ao usuário principal desse cliente. Utilizaremos os
          dados abaixo para configurar o acesso dele a plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Nome completo"
            error={errors.user?.name?.message}
            {...form.register("user.name")}
          />
          <Input
            label="E-mail"
            type="email"
            {...form.register("user.email")}
            error={form.formState.errors.user?.email?.message}
          />

          <Controller
            control={form.control}
            name="user.contact"
            render={({ field }) => (
              <div>
                <label className="text-sm font-medium">
                  Número de telefone
                </label>
                <InputWithMask
                  mask="(__) _____-____"
                  replacement={{ _: /\d/ }}
                  value={field.value}
                  error={form.formState.errors.user?.contact?.message}
                  onChange={(event) => field.onChange(event.target.value)}
                />
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
