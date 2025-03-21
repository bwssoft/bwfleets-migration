import { cn } from "@/@shared/utils/tw-merge";
import { ComponentProps } from "react";

type ContainedLabelValueContainerProps = ComponentProps<"div">;

function ContainedLabelValue({
  className,
  ...rest
}: ContainedLabelValueContainerProps) {
  return (
    <div
      className={cn(
        "border border-border rounded-md shadow-sm bg-card divide-y divide-border",
        className
      )}
      {...rest}
    />
  );
}

interface ContainedLabelValueProps {
  label: string;
  value?: any;
}

function ContainedLabelValueItem({ label, value }: ContainedLabelValueProps) {
  return (
    <div className="grid grid-cols-6 p-2.5 text-xs">
      <span className="col-span-2 font-medium">{label}</span>
      <span className="col-span-4">{value ?? "--"}</span>
    </div>
  );
}

export { ContainedLabelValue, ContainedLabelValueItem };
