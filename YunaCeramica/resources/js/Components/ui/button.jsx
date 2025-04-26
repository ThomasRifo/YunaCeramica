import * as React from "react"
import { cn } from "@/lib/utils"

export const Button = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
          variant === "ghost" && "bg-transparent hover:bg-gray-100",
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"