import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./supabase.types";

export type SupabaseContext = {
    supabase?: SupabaseClient<Database>,
    session?: Session,
    roles?: Database['public']['Tables']['teams']['Row']['role'][]
}

export const SupabaseContext = createContext<SupabaseContext>({});

export const SupabaseContextProvider = ({children, supabase}: {children: ReactNode, supabase: SupabaseClient<Database>}) => {
    
    const [session, setSession] = useState<Session>();
    const [roles, setRoles] = useState<SupabaseContext['roles']>([]);

    useEffect(() => {
        
        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
            
            setSession(session ?? undefined);

            if(session?.user.id)
                setTimeout(async () => {
                    const {data: roles} = await supabase.from('teams').select('role');
                    setRoles(roles?.map(({role}) => role));
                }, 0);
        });
        
        return () => { subscription.unsubscribe(); }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <SupabaseContext.Provider value={{ session, supabase, roles }}>{children}</SupabaseContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSupabase = () => {
    const context = useContext(SupabaseContext)
    return context as Required<SupabaseContext>
}