import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/view/components/ui/card";
import { Input } from "@/view/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { InputWithAddons } from "@/view/components/ui/input-with-addon";

export function GeneralForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da empresa</CardTitle>
        <CardDescription>
          Preencha as informações abaixo de acordo com os dados da empresa do
          seu cliente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1 justify-center">
              <label className="text-sm font-medium">Tipo do documento</label>
              <ToggleGroup type="single" variant="outline" className="w-full">
                <ToggleGroupItem value="cpf" className="w-full">
                  CPF
                </ToggleGroupItem>
                <ToggleGroupItem value="cnpj" className="w-full">
                  CNPJ
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Input
              label="Documento da empresa"
              placeholder="00.000.000/00000-00"
            />
          </div>
          <Input label="Nome da empresa" />
        </div>

        <div>
          <label className="text-sm font-medium">
            Subdomínio da plataforma do cliente
          </label>
          <InputWithAddons
            className="w-full"
            leftAddon={<span>https://</span>}
            rightAddon={<span>.bwfleets.com</span>}
          />
        </div>
      </CardContent>
    </Card>
  );
}
