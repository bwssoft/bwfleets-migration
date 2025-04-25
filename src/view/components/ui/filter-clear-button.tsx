import React, { ComponentProps } from "react";
import { Button } from "./button";
import { XIcon } from "lucide-react";
import { cleanObject } from "@/@shared/utils/clean-object";
import { cn } from "@/@shared/utils/tw-merge";

interface ExtraFiltersButtonProps extends ComponentProps<typeof Button> {
  nuqsParams?: Record<string, unknown>;
}

export function FilterClearButton({
  className,
  nuqsParams,
  ...rest
}: ExtraFiltersButtonProps) {
  const activeFiltersCount = React.useMemo(() => {
    const formattedNuqParams = cleanObject(nuqsParams ?? {});
    return Object.keys(formattedNuqParams ?? {}).length;
  }, [nuqsParams]);

  if (activeFiltersCount === 0) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={activeFiltersCount === 0 ? "icon" : "default"}
      className={cn("relative", className)}
      {...rest}
    >
      Remover filtros
      <XIcon />
    </Button>
  );
}
