import { WWTClient } from "@/@shared/interfaces/wwt-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { InputWithAddons } from "../components/ui/input-with-addon";
import { AddressForm } from "./upsert-bwfleet/address.form";

interface UpsertBWFleetFormProps {
  client: WWTClient;
  open: boolean;
  onOpenChange: () => void;
}

export function UpsertBWFleetForm({
  open,
  onOpenChange,
}: UpsertBWFleetFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[50vw]">
        <DialogHeader>
          <DialogTitle>Informações do cliente BWFleets</DialogTitle>
          <DialogDescription>Atualize os dados a seguir</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col my-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações da empresa</CardTitle>
              <CardDescription>
                Preencha as informações abaixo de acordo com os dados da empresa
                do seu cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1 justify-center">
                    <label className="text-sm font-medium">
                      Tipo do documento
                    </label>
                    <ToggleGroup
                      type="single"
                      variant="outline"
                      className="w-full"
                    >
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

              <div className="w-full">
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

          <AddressForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
