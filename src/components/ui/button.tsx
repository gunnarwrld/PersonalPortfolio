import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// The looks live in src/index.css (.btn …): face and hard shadow are drawn with
// pseudo-elements so a press can move the face onto the shadow.
const buttonVariants = cva("btn", {
  variants: {
    variant: {
      /** The one orange button per view. */
      cta: "btn-cta",
      /** Outline button on the dark stage. */
      ink: "btn-ink",
      /** Outline button on paper surfaces. */
      paper: "btn-paper",
    },
    size: {
      default: "",
      sm: "btn-sm",
      xl: "btn-xl",
      icon: "btn-icon",
    },
  },
  defaultVariants: {
    variant: "ink",
    size: "default",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
