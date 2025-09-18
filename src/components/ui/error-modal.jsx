import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./button.jsx";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ErrorModal = React.forwardRef(
  (
    {
      open,
      onOpenChange,
      title = "Error",
      description,
      errorText = "OK",
      onError,
      className,
      ...props
    },
    ref
  ) => {
    const handleError = () => {
      onError?.();
      onOpenChange?.(false);
    };

    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="h-screen fixed inset-0 bg-white/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            ref={ref}
            className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg",
              className
            )}
            {...props}
          >
            <div className="flex flex-col space-y-4 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                {title && (
                  <Dialog.Title className="text-lg font-semibold text-red-700">
                    {title}
                  </Dialog.Title>
                )}
              </div>
              {description && (
                <Dialog.Description className="text-sm text-muted-foreground">
                  {description}
                </Dialog.Description>
              )}
            </div>

            <div className="flex justify-center sm:justify-end">
              <Button
                variant="outline"
                onClick={handleError}
                className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
              >
                {errorText}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
);

ErrorModal.displayName = "ErrorModal";

export { ErrorModal };
