"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ColorPickerProps {
  value: string | null
  onChange: (color: string | null) => void
  disabled?: boolean
  id?: string
  className?: string
  required?: boolean
  ariaInvalid?: boolean
}

export function ColorPicker({ value, onChange, disabled = false, id, className, required = false, ariaInvalid = false }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const validationInputRef = useRef<HTMLInputElement>(null)

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleDisplayClick = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  const handleClear = () => {
    onChange(null)
  }

  useEffect(() => {
    if (validationInputRef.current) {
      validationInputRef.current.value = value ?? '';
    }
  }, [value]);

  return (
    <div className={cn("relative inline-flex w-full items-center gap-2", className)}>
      {/* Hidden native color input for actual color picking */}
      <input
        ref={inputRef}
        id={id}
        type="color"
        value={value ?? ''}
        onChange={handleColorChange}
        disabled={disabled}
        className="hidden"
        aria-hidden="true"
        required={required && value === null}
      />

      {/* Beautiful display button */}
      <button
        type="button"
        onClick={handleDisplayClick}
        disabled={disabled}
        className={cn(
          "w-full h-10 rounded-md border-1 border-input dark:bg-input/30 transition-all duration-200",
          "flex items-center gap-3 px-3",
          "hover:border-primary/50",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "shadow-xs",
          ariaInvalid ? '!border-destructive' : ''
        )}
      >
        {/* Color preview square */}
        <div
          className="h-6 w-6 rounded border border-primary/20 shadow-sm flex-shrink-0 transition-transform hover:scale-110"
          style={{ backgroundColor: value ?? '' }}
        />

        {/* Hex value display */}
          {value === null ? (
            <span className="text-sm text-muted-foreground">
              No color selected
            </span>
          ) : (
            <span className="text-sm font-medium text-foreground font-mono">
              {value.toUpperCase()}
            </span>
          )}
      </button>

      {value !== null && (
        <Button variant={'outline'} size={'icon-lg'} type="button" onClick={handleClear} disabled={disabled}>
          <X />
        </Button>
      )}
    </div>
  )
}
