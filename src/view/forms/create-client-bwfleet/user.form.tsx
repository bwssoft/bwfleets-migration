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
import {
  UserAccessMethodGeneratedPassword,
  UserAccessMethodToggle,
} from "@/view/components/UserAccessMethod";
import { Label } from "@/view/components/ui/label";

interface UserFormProps {
  form: UseFormReturn<BWFleetCreateClientFormData>;
  errors: FieldErrors<BWFleetCreateClientFormData>;
}

export function UserForm({ form }: UserFormProps) {
  const passwordCreationMethod = form.watch("user.password_creation_method");
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
          <Input label="Nome completo *" {...form.register("user.name")} />
          <Input label="Username *" {...form.register("user.username")} />
          <Input
            label="E-mail (opicional)"
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
                  Número de telefone (opicional)
                </label>
                <InputWithMask
                  mask="(__) _____-____"
                  replacement={{ _: /\d/ }}
                  value={field.value}
                  onChange={(event) => field.onChange(event.target.value)}
                />
              </div>
            )}
          />
          <div className="col-span-full flex gap-4">
            <div className="flex w-full flex-col gap-1">
              <Label>Configurar senha de acesso a partir de</Label>
              <Controller
                control={form.control}
                name="user.password_creation_method"
                render={({ field }) => (
                  <UserAccessMethodToggle
                    value={field.value}
                    className="mb-4 w-full"
                    onChange={(params) => {
                      field.onChange(params.value);
                      form.setValue("user.blocked", params.blocked);
                    }}
                  />
                )}
              />
            </div>

            {passwordCreationMethod === "manual" && (
              <Controller
                control={form.control}
                name="user.password"
                render={({ field }) => (
                  <UserAccessMethodGeneratedPassword
                    value={field.value}
                    onChange={field.onChange}
                    error={form.formState.errors?.user?.password?.message}
                  />
                )}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
