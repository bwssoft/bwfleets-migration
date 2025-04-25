"use client";

import { ArrowDownUpIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { cn } from "@/@shared/utils/tw-merge";
import React from "react";
import { Separator } from "./separator";
import { Badge } from "./badge";

interface FilterSortButtonProps extends React.ComponentProps<"button"> {
  value?: string;
  onValueChange: (value: string) => void;
  isLoading?: boolean;
}

const ORDER_BY_LABEL_MAPPER: Record<string, string> = {
  asc: "Crescente",
  desc: "Decrescente",
  none: "Nenhum",
};

export function FilterSortButton({
  className,
  children,
  value = "none",
  onValueChange,
  isLoading = false,
  ...rest
}: FilterSortButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isLoading} asChild>
        <Button
          variant="outline"
          className={cn("border-dashed", className)}
          // isLoading={isLoading}
          {...rest}
        >
          {!isLoading && <ArrowDownUpIcon />}
          {children}

          {value !== "none" && (
            <div className="flex items-center gap-2 h-full">
              <Separator className="!h-4 bg-border" orientation="vertical" />

              <Badge variant="secondary" className="border border-border">
                {ORDER_BY_LABEL_MAPPER[value]}
              </Badge>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="text-sm min-w-40">
        <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          <DropdownMenuRadioItem value="asc">
            {ORDER_BY_LABEL_MAPPER.asc}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc">
            {ORDER_BY_LABEL_MAPPER.desc}
          </DropdownMenuRadioItem>

          <DropdownMenuSeparator />
          <DropdownMenuRadioItem value="none">
            {ORDER_BY_LABEL_MAPPER.none}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
