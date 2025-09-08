import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/view/components/ui/card";
import { Input } from "@/view/components/ui/input";
import { Controller, UseFormReturn } from "react-hook-form";
import { BWFleetUpsertClientFormData } from "./upsert-bwfleet.handler";
import { InputWithMask } from "@/view/components/ui/input-with-mask";

interface UserFormProps {
  form: UseFormReturn<BWFleetUpsertClientFormData>;
}

export function UserForm({ form }: UserFormProps) {
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
            
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
