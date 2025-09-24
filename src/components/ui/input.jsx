import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
 "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded-md transition-all duration-300 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
 {
   variants: {
     variant: {
       default:
         "border-input border bg-transparent px-3 py-1 text-base shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:border-ring/50",
       glass:
         "bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 text-base shadow-lg focus-visible:bg-white/30 focus-visible:border-white/50 focus-visible:ring-white/30 focus-visible:ring-[3px] hover:bg-white/25",
       filled:
         "bg-gray-50 border border-gray-200 px-3 py-1 text-base shadow-sm focus-visible:bg-white focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:bg-gray-100",
     },
     size: {
       default: "h-9 file:h-7 md:text-sm",
       sm: "h-8 px-2 py-1 text-sm file:h-6",
       lg: "h-10 px-4 py-2 text-base file:h-8",
       xl: "h-12 px-4 py-3 text-lg file:h-10",
     },
   },
   defaultVariants: {
     variant: "default",
     size: "default",
   },
 }
)

function Input({
 className,
 type,
 variant,
 size,
 ...props
}) {
 return (
 (<input
 type={type}
 data-slot="input"
 className={cn(
 inputVariants({ variant, size }),
 "aria-invalid:ring-destructive/20 :ring-destructive/40 aria-invalid:border-destructive",
 className
 )}
 {...props} />)
 );
}

export { Input }
