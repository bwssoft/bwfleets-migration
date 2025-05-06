"use client";

import { useClipboard } from "@/@shared/hooks/use-clipboard";
import { Button } from "@/view/components/ui/button";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface ClientInfoCopyButtonProps {
  text: string;
}

export function ClientInfoCopyButton({ text }: ClientInfoCopyButtonProps) {
  const { isCopied, copy } = useClipboard(4000);

  function handleClick() {
    if (isCopied) return;

    copy(text);
    toast.success("Texto copiado com sucesso");
  }

  return (
    <Button variant="outline" onClick={handleClick}>
      {isCopied ? (
        <React.Fragment>
          <span>Copiado</span>
          <CheckIcon />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <span>Copiar</span>
          <ClipboardIcon />
        </React.Fragment>
      )}
    </Button>
  );
}
