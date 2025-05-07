import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/view/components/ui/card";
import { Input } from "@/view/components/ui/input";
import { UseFormReturn } from "react-hook-form";
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
          <Input label="Nome do usuário" {...form.register("user.name")} />
          <Input
            label="E-mail"
            type="email"
            {...form.register("user.email")}
            error={form.formState.errors.user?.email?.message}
          />

          <div>
            <label className="text-sm font-medium">Contato principal</label>
            <InputWithMask
              mask="(__) _____-____"
              replacement={{ _: /\d/ }}
              {...form.register("user.contact")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
