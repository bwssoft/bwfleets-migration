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

interface UpsertBWFleetFormProps {
  client: WWTClient;
  open: boolean;
  onOpenChange: () => void;
}

export function UpsertBWFleetForm({
  open,
  onOpenChange,
}: UpsertBWFleetFormProps) {
  const { form } = useUpsertBwfleetHandler();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-y-auto !max-w-[50vw] !max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Informações do cliente BWFleets</DialogTitle>
          <DialogDescription>Atualize os dados a seguir</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col my-4 gap-4">
          <GeneralForm form={form} />
          <AddressForm />
          <UserForm form={form} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
