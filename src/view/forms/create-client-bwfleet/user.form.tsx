import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/view/components/ui/card";
import { Input } from "@/view/components/ui/input";
import { Controller, FieldErrors, UseFormReturn } from "react-hook-form";
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

  function handlePasswordCreationMethod(value: string) {
		if (value === "magic-link") {
			const pin = Math.random().toString().slice(2, 8)
			form.setValue("user.magic_link.pin", pin)
		}
	}

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuário *</CardTitle>
        <CardDescription>
          Dados referentes ao usuário principal desse cliente. Utilizaremos os
          dados abaixo para configurar o acesso dele a plataforma.
        </CardDescription>
      </CardHeader>
			<CardContent className="grid grid-cols-2 gap-2">
            <Input label="Username *" containerClassName="col-span-2" {...form.register("user.username")} />
            <div className="col-span-2 flex flex-col gap-1">
              <Label>Configurar senha de acesso a partir de</Label>
              <Controller
                control={form.control}
                name="user.password_creation_method"
                render={({ field }) => (
                  <UserAccessMethodToggle
                    value={field.value}
                    className="mb-4 w-full"
                    onChange={(params) => {
                      handlePasswordCreationMethod(params.value)
                      field.onChange(params.value)
                      form.setValue("user.blocked", params.blocked)
                    }}
                  />
                )}
              />

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
      </CardContent>
    </Card>
  );
}
