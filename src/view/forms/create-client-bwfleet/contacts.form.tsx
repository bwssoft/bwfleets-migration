"use client";

import {
  Controller,
  FieldErrors,
  UseFieldArrayReturn,
  UseFormReturn,
} from "react-hook-form";
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
import { BWFleetCreateClientFormData } from "./useCreateClientBwfleet";
import { CustomError } from "./custom.error";

interface Props {
  form: UseFormReturn<BWFleetCreateClientFormData>;
  contactsFieldArray: UseFieldArrayReturn<
    BWFleetCreateClientFormData,
    "contacts"
  >;
  errors: FieldErrors<BWFleetCreateClientFormData>;
}

export function ContactsForm({ form, contactsFieldArray, errors }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contatos</CardTitle>
        <CardDescription>
          Principais meios de contato ao cliente
          <CustomError
            errors={[
              errors.contacts?.root?.message ?? errors.contacts?.message,
            ]}
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {contactsFieldArray.fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-border rounded-md flex items-baseline gap-4 p-4"
            >
              <Input
                label="Apelido"
                {...form.register(`contacts.${index}.name`)}
                error={form.formState.errors.contacts?.[index]?.name?.message}
              />
              <Input
                label="E-mail"
                {...form.register(`contacts.${index}.email`)}
                error={form.formState.errors.contacts?.[index]?.email?.message}
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

                    {form.formState.errors.contacts?.[index]?.contact && (
                      <small className="text-destructive">
                        {
                          form.formState.errors.contacts?.[index]?.contact
                            ?.message
                        }
                      </small>
                    )}
                  </div>
                )}
              />

              <Input
                label="Cargo do usuario"
                {...form.register(`contacts.${index}.role`)}
                error={form.formState.errors.contacts?.[index]?.role?.message}
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
                role: "",
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
