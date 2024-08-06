import { cn } from "../utils"
import { ComponentPropsWithoutRef, ElementRef, forwardRef, HTMLAttributes } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = forwardRef<ElementRef<typeof DialogPrimitive.Overlay>, ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(
    ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay ref={ref} className={cn(
            "fixed inset-0 bg-slate-950/75 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )} {...props} />
))

const DialogContent = forwardRef<ElementRef<typeof DialogPrimitive.Content>, ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>(
    ({ className, children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content ref={ref} className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 bg-slate-800 p-6 shadow-xl shadow-black rounded-xl \
            duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 \
            data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] \
            data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            className
        )} {...props}>
            {children}
        </DialogPrimitive.Content>
    </DialogPortal>
))

const DialogHeader = ({className, ...props}: HTMLAttributes<HTMLDivElement>) =>
    <div className={cn(className)} {...props} />

const DialogFooter = ({className,...props}: HTMLAttributes<HTMLDivElement>) =>
    <div className={cn("flex flex-wrap gap-4 -mb-3 -mx-3", className)} {...props} />

const DialogTitle = forwardRef<ElementRef<typeof DialogPrimitive.Title>, ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
    ({ className, ...props }, ref) => (
    <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight mb-4", className)} {...props} />
))

const DialogDescription = forwardRef<ElementRef<typeof DialogPrimitive.Description>, ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(
    ({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={cn("text-sm", className)} {...props} />
))

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
}
