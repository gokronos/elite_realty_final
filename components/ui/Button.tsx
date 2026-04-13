import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "default" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center font-medium transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black",
          "disabled:pointer-events-none disabled:opacity-50",

          // Variants
          variant === "primary" && [
            "bg-white text-black",
            "hover:bg-[#d4af37] hover:text-black",
            "focus:ring-[#d4af37]",
          ],
          variant === "secondary" && [
            "bg-transparent text-white border border-white",
            "hover:bg-white hover:text-black",
            "focus:ring-white",
          ],

          // Sizes
          size === "sm" && "px-4 py-2 text-sm",
          size === "default" && "px-6 py-3 text-base",
          size === "lg" && "px-8 py-4 text-lg",

          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
