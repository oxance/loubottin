import { ChangeEvent, useState } from "react";
import { CircleAlert, CircleCheckBig, Info, Loader, LogOut, Search } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import { Toaster } from "sonner";
import { useSupabase } from "./Supabase"
import { contactsTags, Tag } from "./tags";
import { Chips } from "./components/Chips";
import Contacts from "./Contacts";
import Auth from "./Auth";

export type Search = {terms?: string, tags?: Tag[]};

export default function App() {

    const { supabase, session } = useSupabase();

    const [search, setSearch] = useState<Search>({});

    const searchTerms = useDebounceCallback(terms => setSearch(current => ({...current, terms})), 500);

    return <>
        {session && <div className="max-w-screen-xl mx-auto my-8 px-8">
            <nav className="flex flex-row justify-between w-full mb-8">
                <div className="relative whitespace-nowrap">
                    <div className="font-loubottin text-4xl text-oultine text-slate-950">Loup Bottin</div>
                    <div className="relative font-loubottin text-4xl text-primary-400">Loup Bottin</div>
                </div>
                <button className="button-ghost" onClick={() => supabase.auth.signOut()}>
                    Sign Out <LogOut />
                </button>
            </nav>

            <div className="mb-8">
                <div className="relative pl-11 pr-52 rounded-full transition-all bg-slate-800 outline outline-2 outline-slate-700
                    focus-within:outline-primary-700">
                    
                    <input type="search" placeholder="Rechercher dans les contacts..." defaultValue={search.terms} onChange={e => searchTerms(e.target.value)} 
                        className="w-full px-0 peer !bg-transparent !outline-none" />
                    
                    <Search className="absolute top-2 left-3 transition-colors text-slate-600 peer-focus:text-primary-700" />
                    
                    <div className="absolute top-2.5 right-3 flex gap-2 mb-4">
                        <div className="flex gap-2 mb-4">
                            {Object.entries(contactsTags)?.map(([tagName, {icon: Icon, className}]) => {
                                return <Chips key={tagName} name="tags" className={className} 
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(current => {
                                    
                                        current.tags = (current.tags ?? []).filter(i => i !== tagName);
                               
                                        if(e.target.checked)
                                            current.tags = [...current.tags, tagName as Tag];

                                        if(current.tags.length === 0)
                                            delete current.tags;

                                        return {...current};
                                    })}><Icon /> {tagName}</Chips>
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <Contacts search={search} />
        </div>}
        <Auth />
        <Toaster position="bottom-center"
            icons={{
                info: <Info />,
                error: <CircleAlert />,
                warning: <CircleAlert />,
                success: <CircleCheckBig />,
                loading: <Loader className="animate-loader" />
            }}
            toastOptions={{
                classNames: {
                    toast: "p-6 bg-slate-100 pointer-events-auto",
                    icon: "size-6",
                    error: "text-red-500",
                    warning: "text-amber-500",
                    success: "text-primary-500",
                    closeButton: "button-toast-close"
                }
            }}
        />
    </>
}
