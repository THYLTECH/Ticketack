"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  indicator?: "required" | "optional"
  optionalText?: string
}

function Label({
  className,
  indicator,
  optionalText = "(optional)",
  children,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-1 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      
      {indicator === "required" && (
        <span className="text-destructive">*</span>
      )}

      {indicator === "optional" && (
        <span className="text-muted-foreground text-xs font-normal">
          {optionalText}
        </span>
      )}
    </LabelPrimitive.Root>
  )
}

export { Label }