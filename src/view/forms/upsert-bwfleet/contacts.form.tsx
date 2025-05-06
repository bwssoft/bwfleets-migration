"use client";

import {
  Controller,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form";
import {
  BWFleetUpsertClientContactFieldArray,
  BWFleetUpsertClientFormData,
} from "./upsert-bwfleet.handler";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/view/components/ui/card";
import { Input } from "@/view/components/ui/input";
import { Button } from "@/view/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { InputWithMask } from "@/view/components/ui/input-with-mask";

interface Props {
  form: UseFormReturn<BWFleetUpsertClientFormData>;
  contactsFieldArray: UseFieldArrayReturn<BWFleetUpsertClientContactFieldArray>;
}

export function ContactsForm({ form, contactsFieldArray }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contatos</CardTitle>
        <CardDescription>
          Principais meios de contato ao cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {contactsFieldArray.fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-border rounded-md flex items-end gap-4 p-4"
            >
              <Input
                label="Apelido"
                {...form.register(`contacts.${index}.name`)}
              />
              <Input
                label="E-mail"
                {...form.register(`contacts.${index}.email`)}
              />

              <Controller
                control={form.control}
                name={`contacts.${index}.contact`}
                render={({ field }) => (
                  <div className="w-full">
                    <label className="text-sm font-medium">Telefone</label>
                    <InputWithMask
                      value={field.value}
                      mask="(__) _____-____"
                      replacement={{ _: /\d/ }}
                      onChange={(event) => {
                        field.onChange(event.target.value);
                      }}
                    />
                  </div>
                )}
              />

              <Button
                onClick={() => contactsFieldArray.remove(index)}
                size="icon"
                variant="outline"
              >
                <TrashIcon />
              </Button>
            </div>
          ))}

          <Button
            variant="secondary"
            onClick={() =>
              contactsFieldArray.append({
                name: "",
                email: "",
                contact: "",
              })
            }
          >
            <PlusIcon /> Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
