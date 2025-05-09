import * as React from "react";

import { cn } from "@/@shared/utils/tw-merge";

function Input({
  className,
  type,
  label,
  readOnly,
  name,
  error,
  ...props
}: React.ComponentProps<"input"> & { label?: string; error?: string }) {
  return (
    <div className={cn(label ? "space-y-1" : undefined, "w-full")}>
      {label && (
        <label htmlFor={name} className="font-medium text-sm">
          {label}
        </label>
      )}
      <input
        type={type}
        data-slot="input"
        readOnly={readOnly}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          readOnly && "bg-accent/50 cursor-default",
          className
        )}
        name={name}
        {...props}
      />

      {error && <small className="text-destructive">{error}</small>}
    </div>
  );
}

export { Input };
