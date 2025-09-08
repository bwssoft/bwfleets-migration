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
import { Controller, FieldErrors, UseFormReturn, useWatch } from "react-hook-form";
import { Label } from "@/view/components/ui/label";
import { countries } from "@/@shared/constants/countries";
import { ComboBox } from "@/view/components/ui/single-select-combobox";
import { CommandItem } from "@/view/components/ui/command";
import { CheckIcon } from "lucide-react";
import { cn } from "@/@shared/utils/tw-merge";
import { useQueryClient } from "@tanstack/react-query";
import { findAddressByPostalCode } from "@/@shared/actions/viacep.actions";
import { BWFleetCreateClientFormData } from "./useCreateClientBwfleet";
import { CustomError } from "./custom.error";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/view/components/ui/accordion";

interface Props {
  form: UseFormReturn<BWFleetCreateClientFormData>;
  errors: FieldErrors<BWFleetCreateClientFormData>;
}

export function AddressForm({ form, errors }: Props) {
  const queryClient = useQueryClient();

  const formCountryCode = useWatch({
    control: form.control,
    name: "address.country",
  });

  const CACHE_TIME_IN_MS = 1296000000

  function handlePostalCodeLoading() {
		form.setValue("address.district", "Buscando endereço por CEP...")
		form.setValue("address.city", "Buscando endereço por CEP...")
		form.setValue("address.street", "Buscando endereço por CEP...")
		form.setValue("address.state", "Buscando endereço por CEP...")
	}

  async function handlePostalCodeChange(postalCode: string) {
    if (postalCode.length < 8) return

		handlePostalCodeLoading()

		const viaCepAddress = await queryClient.fetchQuery({
			queryKey: ["viacep", postalCode],
			queryFn: () => findAddressByPostalCode(postalCode),
			staleTime: CACHE_TIME_IN_MS,
			gcTime: CACHE_TIME_IN_MS,
		})

		if (!viaCepAddress) {
			return
		}

		form.setValue("address.district", viaCepAddress.bairro)
		form.setValue("address.city", viaCepAddress.localidade)
		form.setValue("address.street", viaCepAddress.logradouro)
		form.setValue("address.state", viaCepAddress.uf)

		return viaCepAddress
  }

  return (
    <Card>
      <Accordion type="single">
        <AccordionItem value="address">
          <AccordionTrigger className="w-full pr-5 items-center">
            <CardHeader className="w-full gap-0">
              <CardTitle className="text-lg font-semibold">Endereço <span className="text-muted-foreground text-base">(Opcional)</span></CardTitle>
              <CardDescription>
                Dados do endereço principal do cliente
              </CardDescription>
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <Controller
                    control={form.control}
                    name="address.country"
                    render={({ field }) => (
                      <div>
                        <Label>País</Label>
                        <ComboBox
                          placeholder="Selecione um país..."
                          selectedItem={field.value}
                          closeOnSelect
                        >
                          {countries.map((country) => {
                            const isSelected = country.code === field.value;

                            return (
                              <CommandItem
                                onSelect={() => field.onChange(country.code)}
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
                        <CustomError 
                          errors={[
                            errors.address?.country?.message,
                          ]}
                        />
                      </div>
                    )}
                  />
                </div>

                <Controller
                  control={form.control}
                  name="address.cep"
                  render={({ field }) => (
                    <div>
                      <label className="text-sm font-medium">Código-postal</label>

                      {!formCountryCode || formCountryCode === "BR" ? (
                        <InputWithMask
                          mask="_____-___"
                          value={field.value}
                          replacement={{ _: /\d/ }}
                          error={errors.address?.cep?.message}
                          onChange={(event) => {
                            const _cep = event.target.value;
                            field.onChange(_cep);

                            if (_cep.length === 9) {
                              handlePostalCodeChange(_cep);
                            }
                          }}
                        />
                      ) : (
                        <Input error={errors.address?.cep?.message} {...form.register("address.cep")} />
                      )}
                    </div>
                  )}
                />
                <Input label="Rua" error={errors.address?.street?.message} {...form.register("address.street")} />
                <Input label="Número" error={errors.address?.number?.message} {...form.register("address.number")} />
                <Input label="Bairro" error={errors.address?.district?.message} {...form.register("address.district")} />
                <Input label="Cidade" error={errors.address?.city?.message} {...form.register("address.city")} />
                <Input label="Estado" error={errors.address?.state?.message} {...form.register("address.state")} />
              </div>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
