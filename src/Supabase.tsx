import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./supabase.types";

export type SupabaseContext = {
    supabase?: SupabaseClient<Database>
    session?: Session
    ready: boolean
    roles: Record<Database['public']['Tables']['teams']['Row']['role'], boolean>
}

export const SupabaseContext = createContext<SupabaseContext>({
    ready: false,
    roles: {} as SupabaseContext['roles']
});

export function SupabaseContextProvider ({children, supabase}: {children: ReactNode, supabase: SupabaseClient<Database>}) {
    
    const [session, setSession] = useState<Session>();
    const [ready, setReady] = useState(false);
    const [roles, setRoles] = useState<SupabaseContext['roles']>({} as SupabaseContext['roles']);

    useEffect(() => {
        
        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {

            setReady(true);
            setSession(session ?? undefined);

            if(session?.user.id)
                setTimeout(async () => {
                    const {data} = await supabase.from('teams').select('role');
                    setRoles(Object.fromEntries(data?.map(({role}) => [role, true]) ?? []) as SupabaseContext['roles']);
                }, 0);
        });
        
        return () => { subscription.unsubscribe(); }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <SupabaseContext.Provider value={{ session, supabase, roles, ready }}>{children}</SupabaseContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSupabase () {
    const context = useContext(SupabaseContext)
    return context as Required<SupabaseContext>
}

export function useHandler<T extends (...args: Parameters<T>) => void>(cb: T, errorCb?: (error: Error) => void) {
    const [isLoading, setIsLoading] = useState(false);
    return {
        isLoading,
        action: async (...args: Parameters<T>) => {
            try { setIsLoading(true); await cb(...args); }
            catch(error: unknown) { errorCb ? errorCb(error as Error) : console.error(error); }
            finally { setIsLoading(false); }
        }
    }
}