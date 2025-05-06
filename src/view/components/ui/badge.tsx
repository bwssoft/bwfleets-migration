import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/@shared/utils/tw-merge"



const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md ring-1 ring-inset px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary/90 text-primary-foreground ring-primary-foreground",
        green:
          "bg-green-100 text-green-800 ring-green-500/30 dark:ring-green-400 dark:bg-green-700 dark:text-white",
        gray: "bg-gray-100 text-gray-800 ring-gray-500/30 dark:bg-gray-300/20 dark:text-white",
        yellow:
          "bg-yellow-100 text-yellow-800 ring-yellow-700/30 dark:ring-yellow-400 dark:bg-yellow-700 dark:text-white",
        red: "bg-red-100 text-red-800 ring-red-700/30 dark:ring-red-400 dark:bg-red-700 dark:text-white",
        secondary:
          "ring-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "ring-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent ring-1 ring-border [a&]:hover:text-accent-foreground",
        blue: "bg-blue-100 text-blue-800 ring-blue-500/30 dark:ring-blue-400 dark:bg-blue-700 dark:text-white",      
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
