"use client";
import React from "react";

import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { SearchIcon } from "lucide-react";
import { useQueryParam } from "@/@shared/hooks/use-query-param";

export function SearchClientForm() {
  const [clientName, setClientName] = React.useState<string>();
  const clientParam = useQueryParam({ key: "accountName" });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (clientName) {
      clientParam.replace(clientName);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <Input
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Pesquisar cliente"
          className="w-72"
        />
        <Button>
          <SearchIcon size="icon" />
        </Button>
      </div>
    </form>
  );
}
