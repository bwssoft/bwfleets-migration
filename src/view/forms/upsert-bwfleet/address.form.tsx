import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/view/components/ui/card";
import { Input } from "@/view/components/ui/input";
import { InputWithMask } from "@/view/components/ui/input-with-mask";
import { Controller, UseFormReturn } from "react-hook-form";
import { BWFleetUpsertClientFormData } from "./upsert-bwfleet.handler";
import { Label } from "@/view/components/ui/label";
import { countries } from "@/@shared/constants/countries";
import { ComboBox } from "@/view/components/ui/single-select-combobox";
import { CommandItem } from "@/view/components/ui/command";
import { CheckIcon } from "lucide-react";
import { cn } from "@/@shared/utils/tw-merge";

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

          <Controller
            control={form.control}
            name="country"
            render={({ field }) => (
              <div>
                <Label>País</Label>
                <ComboBox
                  placeholder="Selecione um país..."
                  selectedItem={
                    field.value
                      ? `${field.value.name} (${field.value?.code})`
                      : undefined
                  }
                  closeOnSelect
                >
                  {countries.map((country) => {
                    const isSelected = country.code === field.value?.code;

                    return (
                      <CommandItem
                        onSelect={() => field.onChange(country)}
                        key={country.code}
                        value={country.code}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4 transition-opacity",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                          aria-hidden="true"
                        />

                        {country.name}
                      </CommandItem>
                    );
                  })}
                </ComboBox>
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
