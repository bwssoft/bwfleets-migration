"use client";

import { WWTClient } from "@/@shared/interfaces/wwt-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/view/components/ui/dialog";
import { AddressForm } from "./address.form";
import { UserForm } from "./user.form";
import { GeneralForm } from "./general.form";
import { useUpsertBwfleetHandler } from "./upsert-bwfleet.handler";
import { Button } from "@/view/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useDisclosure } from "@/@shared/hooks/use-disclosure";
import { BFleetClient } from "@prisma/client";
import { ContactsForm } from "./contacts.form";

interface UpsertBWFleetFormProps {
  bfleetClient: BFleetClient | null;
  wwtClient: WWTClient;
}

export function UpsertBWFleetForm({
  wwtClient,
  bfleetClient,
}: UpsertBWFleetFormProps) {
  const editFormDisclosure = useDisclosure();
  const { form, handleSubmit, contactsFieldArray } = useUpsertBwfleetHandler({
    wwtClient,
    bfleetClient,
  });

  return (
    <Dialog
      open={editFormDisclosure.isOpen}
      onOpenChange={editFormDisclosure.onClose}
    >
      <Button onClick={editFormDisclosure.onOpen} variant="outline">
        <PencilIcon />
        Editar
      </Button>
      <DialogContent className="overflow-y-auto !max-w-[50vw] !max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Informações do cliente BWFleets</DialogTitle>
          <DialogDescription>Atualize os dados a seguir</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col my-4 gap-4">
          <GeneralForm form={form} />
          <ContactsForm form={form} contactsFieldArray={contactsFieldArray} />
          <AddressForm form={form} />
          <UserForm form={form} />
        </div>
        <Button
          className="w-fit"
          disabled={form.formState.isSubmitting}
          onClick={() => handleSubmit()}
        >
          Salvar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
