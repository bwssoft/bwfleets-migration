import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/view/components/ui/card";
import { Input } from "@/view/components/ui/input";
import { InputWithMask } from "@/view/components/ui/input-with-mask";
import { UseFormReturn } from "react-hook-form";
import { BWFleetUpsertClientFormData } from "./upsert-bwfleet.handler";

interface Props {
  form: UseFormReturn<BWFleetUpsertClientFormData>;
}
export function AddressForm({ form }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Endereço</CardTitle>
        <CardDescription>
          Dados do endereço principal do cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium">Código-postal</label>
            <InputWithMask
              mask="_____-___"
              replacement={{ _: /\d/ }}
              {...form.register("cep")}
            />
          </div>
          <Input label="Rua" {...form.register("street")} />
          <Input label="Número" {...form.register("number")} />
          <Input label="Bairro" {...form.register("district")} />
          <Input label="Cidade" {...form.register("city")} />
          <Input label="Estado" {...form.register("state")} />
          <Input label="País" {...form.register("country")} />
        </div>
      </CardContent>
    </Card>
  );
}
