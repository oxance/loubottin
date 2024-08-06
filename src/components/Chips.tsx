import { forwardRef, InputHTMLAttributes, useId } from "react"
import { cn } from "../utils"

export const Chips = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({children, name, className, ...props}, ref) => {

    const scope = useId();
    const clickable = !!props.onChange;

    return <span>
        <input ref={ref} type="checkbox" id={scope + name} name={name} disabled={!clickable} className="peer hidden" {...props} />
        <label htmlFor={scope + name} className={cn(
            "flex items-center text-xs rounded-md px-1 py-0.5 border border-dashed border-current [&>.lucide]:size-4 [&>.lucide]:mr-1",
            clickable ? "cursor-pointer" : "",
            className
        )}>{children}</label>
    </span>
});