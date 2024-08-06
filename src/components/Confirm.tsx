import { ComponentPropsWithoutRef, ElementRef, forwardRef, MouseEventHandler } from "react"
import { cn } from "../utils"
import { Check, X } from "lucide-react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

export const Confirm = PopoverPrimitive.Root
export const ConfirmTrigger = PopoverPrimitive.Trigger

export const ConfirmContent = forwardRef<
    ElementRef<typeof PopoverPrimitive.Content>,
    ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
        classNames?: {
            arrow?: string
        },
        onConfirm: MouseEventHandler<HTMLButtonElement>
    }
>(({ className, classNames, children, onConfirm, ...props }, ref) => {
    return <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content side="top"
            ref={ref}
            className={cn(
                "z-50 w-96 max-w-[calc(100%_-_1rem)] p-4 rounded-2xl bg-slate-700 shadow-2xl shadow-black",
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95",
                "data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
                "data-[side=top]:slide-in-from-bottom-2",
                className
            )}
            {...props}
        >
            <div className="flex flex-col">
                {children}
                <div className="flex gap-4 self-end mt-4 -mb-2 -mr-2">
                    <PopoverPrimitive.Close asChild>
                        <button className="button-ghost"><X /> Non</button>
                    </PopoverPrimitive.Close>
                    <button className="success" onClick={onConfirm}><Check /> Oui</button>
                </div>
            </div>
            <PopoverPrimitive.Arrow className={cn(classNames?.arrow)} />
        </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
})
