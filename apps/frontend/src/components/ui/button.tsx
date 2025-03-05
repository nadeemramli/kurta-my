import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-300",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 transform-gpu hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0",
        destructive:
          "bg-red-500 text-neutral-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90 transform-gpu hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0",
        outline:
          "border border-neutral-200 bg-white shadow-sm hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 transform-gpu hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0",
        secondary:
          "bg-neutral-100 text-neutral-900 shadow-sm hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80 transform-gpu hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0",
        ghost:
          "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 transform-gpu hover:-translate-y-0.5 active:translate-y-0",
        link: "text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50",
        bento:
          "bg-neutral-900/5 dark:bg-neutral-100/5 border border-neutral-200/10 dark:border-neutral-800 hover:bg-neutral-900/10 dark:hover:bg-neutral-100/10 text-neutral-900 dark:text-neutral-100 transform perspective-1000 hover:-translate-y-0.5 hover:translate-x-0 hover:rotate-[0.5deg] hover:scale-[1.02] hover:shadow-xl hover:shadow-neutral-900/10 dark:hover:shadow-neutral-100/10 active:translate-y-0 active:rotate-0 active:scale-100",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
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

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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
