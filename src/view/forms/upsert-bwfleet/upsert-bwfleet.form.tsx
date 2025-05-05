import { WWTClient } from "@/@shared/interfaces/wwt-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/view/components/ui/dialog";
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
import { AddressForm } from "./address.form";
import { UserForm } from "./user.form";
import { GeneralForm } from "./general.form";

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
      <DialogContent className="overflow-y-auto !max-w-[50vw] !max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Informações do cliente BWFleets</DialogTitle>
          <DialogDescription>Atualize os dados a seguir</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col my-4 gap-4">
          <GeneralForm />
          <AddressForm />
          <UserForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
