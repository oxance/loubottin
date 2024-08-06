import { useMediaQuery } from "usehooks-ts"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./Drawer"
import { Dialog as DialogP, DialogTrigger as DialogTriggerP, DialogClose as DialogCloseP, DialogContent as DialogContentP, 
         DialogDescription as DialogDescriptionP, DialogHeader as DialogHeaderP, DialogTitle as DialogTitleP,
         DialogFooter as DialogFooterP } from "./Dialog"

interface BaseProps {
    children: React.ReactNode
}

interface RootDialogProps extends BaseProps {
    open?: boolean
    dismissible?: boolean
    onOpenChange?: (open: boolean) => void
    onClose?: () => void
}
  
interface DialogProps extends BaseProps {
    className?: string
    asChild?: true
}

const Dialog = ({ children, ...props }: RootDialogProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const Dialog = isDesktop ? DialogP : Drawer;
    return <Dialog {...props}>{children}</Dialog>;
}

const DialogTrigger = ({ className, children, ...props }: DialogProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const DialogTrigger = isDesktop ? DialogTriggerP : DrawerTrigger;
    return <DialogTrigger className={className} {...props}>{children}</DialogTrigger>;
}

const DialogClose = ({ className, children, ...props }: DialogProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const DialogClose = isDesktop ? DialogCloseP : DrawerClose
    return <DialogClose className={className} {...props}>{children}</DialogClose>;
}

const DialogContent = ({ className, children, ...props }: DialogProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const DialogContent = isDesktop ? DialogContentP : DrawerContent
    return <DialogContent aria-describedby="" className={className} {...props}>{children}</DialogContent>;
}
  
const DialogDescription = ({ className, children, ...props }: DialogProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const DialogDescription = isDesktop ? DialogDescriptionP : DrawerDescription
    return <DialogDescription className={className} {...props}>{children}</DialogDescription>;
}
  
const DialogHeader = ({ className, children, ...props }: DialogProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const DialogHeader = isDesktop ? DialogHeaderP : DrawerHeader
    return <DialogHeader className={className} {...props}>{children}</DialogHeader>;
}
  
const DialogTitle = ({ className, children, ...props }: DialogProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const DialogTitle = isDesktop ? DialogTitleP : DrawerTitle
    return <DialogTitle className={className} {...props}>{children} </DialogTitle>;
}
  
const DialogFooter = ({ className, children, ...props }: DialogProps) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const DialogFooter = isDesktop ? DialogFooterP : DrawerFooter
    return <DialogFooter className={className} {...props}>{children} </DialogFooter>;
}
  
export {
    Dialog,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
}