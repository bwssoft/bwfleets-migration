import { cn } from "@/@shared/utils/tw-merge";
import React, { ComponentProps } from "react";

export const PageLayout = React.forwardRef<
  HTMLDivElement,
  ComponentProps<"div">
>(({ className, ...rest }, ref) => (
  <div ref={ref} className={cn("p-6 overflow-y-auto", className)} {...rest} />
));

PageLayout.displayName = "PageLayout";
