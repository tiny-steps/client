import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
 "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 :ring-destructive/40 aria-invalid:border-destructive transform hover:scale-105 active:scale-95",
 {
 variants: {
 variant: {
 default:
 "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-lg",
 destructive:
 "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 :ring-destructive/40 hover:shadow-lg",
 outline:
 "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground :bg-input/50 hover:border-accent hover:shadow-md",
 secondary:
 "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 hover:shadow-lg",
 ghost:
 "hover:bg-accent hover:text-accent-foreground :bg-accent/50 hover:shadow-sm",
 link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
 glass:
 "bg-white/20 backdrop-blur-md border border-white/30 text-gray-700 shadow-lg hover:bg-white/30 hover:shadow-xl",
 },
 size: {
 default: "h-9 px-4 py-2 has-[>svg]:px-3",
 sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
 lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
 xl: "h-12 rounded-lg px-8 has-[>svg]:px-6 text-base",
 icon: "size-9",
 },
 },
 defaultVariants: {
 variant: "default",
 size: "default",
 },
 }
)

function Button({
 className,
 variant,
 size,
 asChild = false,
 ...props
}) {
 const Comp = asChild ? Slot : "button"

 return (
 (<Comp
 data-slot="button"
 className={cn(buttonVariants({ variant, size, className }))}
 {...props} />)
 );
}

export { Button, buttonVariants }
