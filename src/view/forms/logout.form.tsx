"use client";

import { signOut } from "@/@shared/actions/user.actions";
import LocalStorageAdapter from "@/@shared/provider/bwfleets/@base/LocalStorageAdapter";
import { Button } from "@/view/components/ui/button";
import { LogOutIcon } from "lucide-react";

export function LogoutForm() {
  async function handleAction() {
    LocalStorageAdapter.remove("ACCESS_TOKEN");
    await signOut();
  }

  return (
    <form action={handleAction}>
      <Button type="submit" className="w-full justify-start" variant="ghost">
        <LogOutIcon />
        <span>Desconectar</span>
      </Button>
    </form>
  );
}
