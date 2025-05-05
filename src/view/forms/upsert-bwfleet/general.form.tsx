"use client";

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
import { Controller, UseFormReturn, useWatch } from "react-hook-form";
import { BWFleetUpsertClientFormData } from "./upsert-bwfleet.handler";
import React from "react";
import { InputWithMask } from "@/view/components/ui/input-with-mask";

interface GeneralFormProps {
  form: UseFormReturn<BWFleetUpsertClientFormData>;
}

export function GeneralForm({ form }: GeneralFormProps) {
  const documentType = useWatch({
    control: form.control,
    name: "document_type",
  });

  const documentTypeMask = React.useMemo(() => {
    if (documentType === "cpf") {
      return "___.___.___-__";
    }

    if (documentType === "cnpj") {
      return "__.___.___/____-__";
    }

    return undefined;
  }, [documentType]);

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
            <Controller
              control={form.control}
              name="document_type"
              render={({ field }) => (
                <div className="flex flex-col gap-1 justify-center">
                  <label className="text-sm font-medium">
                    Tipo do documento
                  </label>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    className="w-full"
                    value={field.value}
                    onValueChange={(value) => {
                      if (value === field.value || !value) return;

                      field.onChange(value);
                      form.setValue("document", "");
                    }}
                  >
                    <ToggleGroupItem value="cpf" className="w-full">
                      CPF
                    </ToggleGroupItem>
                    <ToggleGroupItem value="cnpj" className="w-full">
                      CNPJ
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              )}
            />

            <Controller
              control={form.control}
              name="document"
              render={({ field }) => (
                <div className="flex flex-col gap-1 justify-center">
                  <label className="text-sm font-medium">
                    Documento do cliente
                  </label>
                  <InputWithMask
                    mask={documentTypeMask}
                    placeholder={
                      !documentTypeMask
                        ? "Selecione o tipo do documento"
                        : undefined
                    }
                    replacement={{ _: /\d/ }}
                    value={field.value}
                    onChange={(event) => {
                      field.onChange(event.target.value);
                    }}
                  />
                </div>
              )}
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
