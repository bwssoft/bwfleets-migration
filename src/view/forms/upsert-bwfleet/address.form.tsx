"use client";

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
import { useQueryClient } from "@tanstack/react-query";
import { findAddressByPostalCode } from "@/@shared/actions/viacep.actions";

interface Props {
  form: UseFormReturn<BWFleetUpsertClientFormData>;
}

export function AddressForm({ form }: Props) {
  const queryClient = useQueryClient();

  async function handlePostalCodeChange(postalCode: string) {
    const countryCode = form.getValues("country.code");
    if (countryCode && countryCode !== "BR") return;

    const result = await queryClient.fetchQuery({
      queryKey: ["viacep", postalCode],
      queryFn: () => findAddressByPostalCode(postalCode),
    });

    form.setValue("street", result.logradouro);
    form.setValue("district", result.bairro);
    form.setValue("city", result.localidade);
    form.setValue("state", result.uf);
  }

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
          <div className="col-span-2">
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

          <Controller
            control={form.control}
            name="cep"
            render={({ field }) => (
              <div>
                <label className="text-sm font-medium">Código-postal</label>
                <InputWithMask
                  mask="_____-___"
                  value={field.value}
                  replacement={{ _: /\d/ }}
                  onChange={(event) => {
                    const _cep = event.target.value;
                    field.onChange(_cep);

                    if (_cep.length === 9) {
                      handlePostalCodeChange(_cep);
                    }
                  }}
                />
              </div>
            )}
          />
          <Input label="Rua" {...form.register("street")} />
          <Input label="Número" {...form.register("number")} />
          <Input label="Bairro" {...form.register("district")} />
          <Input label="Cidade" {...form.register("city")} />
          <Input label="Estado" {...form.register("state")} />
        </div>
      </CardContent>
    </Card>
  );
}
