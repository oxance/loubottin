import { ComponentProps, ComponentPropsWithoutRef, ElementRef, forwardRef, HTMLAttributes } from "react"
import { cn } from "../utils"
import { Drawer as DrawerPrimitive } from "vaul"

const Drawer = ({shouldScaleBackground = true, ...props}: ComponentProps<typeof DrawerPrimitive.Root>) => 
    <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />

const DrawerTrigger = DrawerPrimitive.Trigger
const DrawerPortal = DrawerPrimitive.Portal
const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = forwardRef<ElementRef<typeof DrawerPrimitive.Overlay>, ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>>(
    ({ className, ...props }, ref) => (
    <DrawerPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-slate-950/75", className)} {...props} />
))

const DrawerContent = forwardRef<ElementRef<typeof DrawerPrimitive.Content>, ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>>(
    ({ className, children, ...props }, ref) => (
    <DrawerPortal>
        <DrawerOverlay />
        <DrawerPrimitive.Content
        ref={ref}
        className={cn(
            "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-xl bg-slate-800 p-4",
            className
        )} {...props}>
            <div className="mx-auto mb-6 h-2 w-24 rounded-full bg-slate-700" />
            {children}
        </DrawerPrimitive.Content>
    </DrawerPortal>
))

const DrawerHeader = ({className, ...props}: HTMLAttributes<HTMLDivElement>) =>
  <div className={cn(className)} {...props} />

const DrawerFooter = ({className, ...props}: HTMLAttributes<HTMLDivElement>) =>
  <div className={cn("flex flex-wrap gap-4", className)} {...props} />

const DrawerTitle = forwardRef<ElementRef<typeof DrawerPrimitive.Title>, ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>>(
    ({ className, ...props }, ref) => (
    <DrawerPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight mb-4", className)} {...props} />
))

const DrawerDescription = forwardRef<ElementRef<typeof DrawerPrimitive.Description>, ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>>(
    ({ className, ...props }, ref) => (
    <DrawerPrimitive.Description ref={ref} className={cn("text-sm", className)} {...props} />
))

export {
    Drawer,
    DrawerPortal,
    DrawerOverlay,
    DrawerTrigger,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
    DrawerDescription,
}
