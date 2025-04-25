import React, { ComponentProps } from "react";
import { Button } from "./button";
import { ListFilterPlusIcon } from "lucide-react";
import { cleanObject } from "@/@shared/utils/clean-object";
import { cn } from "@/@shared/utils/tw-merge";
import { Badge } from "./badge";
import { Separator } from "./separator";

interface ExtraFiltersButtonProps extends ComponentProps<typeof Button> {
  nuqsParams?: Record<string, unknown>;
}

export function ExtraFiltersButton({
  className,
  nuqsParams,
  ...rest
}: ExtraFiltersButtonProps) {
  const activeFiltersCount = React.useMemo(() => {
    const formattedNuqParams = cleanObject(nuqsParams ?? {});
    return Object.keys(formattedNuqParams ?? {}).length;
  }, [nuqsParams]);

  return (
    <Button
      type="button"
      variant="outline"
      size={activeFiltersCount === 0 ? "icon" : "default"}
      className={cn("relative border-dashed", className)}
      {...rest}
    >
      <ListFilterPlusIcon />
      {activeFiltersCount !== 0 && (
        <div className="flex h-full gap-2">
          <Separator orientation="vertical" />

          <Badge variant="outline">{activeFiltersCount}</Badge>
        </div>
      )}
    </Button>
  );
}
