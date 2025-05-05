import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/view/components/ui/card";
import { Input } from "@/view/components/ui/input";
import { InputWithMask } from "@/view/components/ui/input-with-mask";

export function AddressForm() {
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
            <InputWithMask mask="_____-___" replacement={{ _: /\d/ }} />
          </div>
          <Input label="Rua" />
          <Input label="Número" />
          <Input label="Bairro" />
          <Input label="Cidade" />
          <Input label="Estado" />
          <Input label="País" />
        </div>
      </CardContent>
    </Card>
  );
}
