"use client";

import * as React from "react";
import { Input } from "./input";
import { cn } from "@/@shared/utils/tw-merge";

type InputAddonProps = {
  children: React.ReactNode;
  className?: string;
};

export function InputLeftAddon({ children, className }: InputAddonProps) {
  return (
    <div
      className={cn(
        "flex items-center px-3 rounded-l-md border border-r-0 border-input bg-secondary text-muted-foreground text-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function InputRightAddon({ children, className }: InputAddonProps) {
  return (
    <div
      className={cn(
        "flex items-center px-3 rounded-r-md border border-l-0 border-input bg-secondary text-muted-foreground text-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export type InputWithAddonsProps = {
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const InputWithAddons = React.forwardRef<
  HTMLInputElement,
  InputWithAddonsProps
>(({ leftAddon, rightAddon, className, ...props }, ref) => {
  return (
    <div className="flex">
      {leftAddon && <InputLeftAddon>{leftAddon}</InputLeftAddon>}
      <Input
        ref={ref}
        className={cn(
          leftAddon && "rounded-l-none",
          rightAddon && "rounded-r-none",
          className
        )}
        {...props}
      />
      {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
    </div>
  );
});

InputWithAddons.displayName = "InputWithAddons";
