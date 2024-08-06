import { Building, ExternalLink, LucideIcon, User2 } from "lucide-react";

export const contactsTags: Record<Tag, {icon: LucideIcon, className: string}> = {
    salarié: {
        icon: User2,
        className: "text-primary-500 bg-primary-500/10 peer-checked:bg-primary-500 peer-checked:text-white peer-checked:border-transparent"
    },
    établissement: {
        icon: Building,
        className: "text-pink-400 bg-pink-400/10 peer-checked:bg-pink-400 peer-checked:text-white peer-checked:border-transparent"
    },
    externe: {
        icon: ExternalLink,
        className: "text-cyan-400 bg-cyan-400/10 peer-checked:bg-cyan-400 peer-checked:text-black peer-checked:border-transparent"
    }
}

export type Tag = 'établissement' | 'salarié' | 'externe';
