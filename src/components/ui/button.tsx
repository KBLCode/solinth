"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-radiant-amber focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary glassmorphic button with Radiant Amber
        default:
          "glass-button bg-solar-gradient text-solar-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",

        // Destructive glassmorphic button
        destructive:
          "glass-button bg-gradient-to-br from-red-500 to-red-600 text-solar-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",

        // Outline glassmorphic button
        outline:
          "glass-card border-2 border-radiant-amber/30 bg-transparent text-dusk-slate dark:text-solar-white hover:bg-radiant-amber/10 hover:border-radiant-amber/50",

        // Secondary glassmorphic button
        secondary:
          "glass-card bg-midday-sand/50 dark:bg-midnight-graphite/50 text-dusk-slate dark:text-solar-white hover:bg-midday-sand/70 dark:hover:bg-midnight-graphite/70",

        // Ghost button
        ghost:
          "text-dusk-slate dark:text-solar-white hover:bg-radiant-amber/10 hover:text-radiant-amber",

        // Link button
        link: "text-radiant-amber underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
