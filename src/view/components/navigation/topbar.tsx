import React, { ComponentProps } from "react";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { cn } from "@/@shared/utils/tw-merge";

type TopbarProps = ComponentProps<"div">;

function Topbar({ children, ...rest }: TopbarProps) {
  return (
    <div
      {...rest}
      className="h-14 border-b border-border px-6 flex items-center gap-3 bg-card shadow-xs"
    >
      <SidebarTrigger variant="outline" />

      <Separator orientation="vertical" className="!h-6 bg-border" />

      {children}
    </div>
  );
}

type TopbarTitleProps = ComponentProps<"h3">;

function TopbarTitle({ className, ...rest }: TopbarTitleProps) {
  return <h3 className={cn("font-medium text-base", className)} {...rest} />;
}

export { Topbar, TopbarTitle };
