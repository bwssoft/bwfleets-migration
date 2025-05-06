import { ComponentProps } from "react";
import { Label } from "./label";
import { cn } from "@/@shared/utils/tw-merge";

interface LabelValueProps extends ComponentProps<"div"> {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

export function LabelValue({
  label,
  value,
  className,
  ...rest
}: LabelValueProps) {
  return (
    <div className={cn("flex flex-col gap-0", className)} {...rest}>
      <Label>{label}</Label>
      <span className="text-muted-foreground text-sm">{value ?? "--"}</span>
    </div>
  );
}
