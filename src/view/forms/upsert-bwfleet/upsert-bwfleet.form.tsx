"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/view/components/ui/dialog";
import { useUpsertBwfleetHandler } from "./upsert-bwfleet.handler";
import { Button } from "@/view/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useDisclosure } from "@/@shared/hooks/use-disclosure";
import { IBFleetClient, IWanwayClient } from "@/@shared/interfaces";
import { ContentForm } from "./content.form";

interface UpsertBWFleetFormProps {
  bfleetClient: IBFleetClient | null;
  wwtClient: IWanwayClient;
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

        <ContentForm 
          form={form}
          handleSubmit={handleSubmit}
          contactsFieldArray={contactsFieldArray}
        />
      </DialogContent>
    </Dialog>
  );
}
