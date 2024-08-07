import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./supabase.types";

export type SupabaseContext = {
    supabase?: SupabaseClient<Database>
    session?: Session
    roles: Record<Database['public']['Tables']['teams']['Row']['role'], boolean>,
    state: {
        ready?: boolean,
        recovery?: boolean
    }
}

export const SupabaseContext = createContext<SupabaseContext>({
    state: {},
    roles: {} as SupabaseContext['roles']
});

export function SupabaseContextProvider ({children, supabase}: {children: ReactNode, supabase: SupabaseClient<Database>}) {
    
    const [session, setSession] = useState<Session>();
    const [roles, setRoles] = useState<SupabaseContext['roles']>({} as SupabaseContext['roles']);
    const [state, setState] = useState<SupabaseContext['state']>({});

    useEffect(() => {
        
        const {data: {subscription}} = supabase.auth.onAuthStateChange((event, session) => {

            if(event === "PASSWORD_RECOVERY")
                setState(current => ({...current, recovery: true}))

            setState(current => ({...current, ready: true}));
            setSession(session ?? undefined);

            if(session)
                setTimeout(async () => {
                    const {data} = await supabase.from('teams').select('role');
                    setRoles(Object.fromEntries(data?.map(({role}) => [role, true]) ?? []) as SupabaseContext['roles']);
                }, 0);
        });
        
        return () => { subscription.unsubscribe(); }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <SupabaseContext.Provider value={{ session, supabase, roles, state }}>{children}</SupabaseContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSupabase () {
    const context = useContext(SupabaseContext)
    return context as Required<SupabaseContext>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useHandler<T extends (...args: Parameters<T>) => void>(cb: T, errorCb?: (error: Error) => void): [(...args: Parameters<T>) => void, boolean] {
    const [isLoading, setIsLoading] = useState(false);
    return [
        async (...args: Parameters<T>) => {
            try { setIsLoading(true); await cb(...args); }
            catch(error: unknown) { errorCb ? errorCb(error as Error) : console.error(error); }
            finally { setIsLoading(false); }
        },
        isLoading
    ];
}

// eslint-disable-next-line react-refresh/only-export-components
export function getFormData<T>(form: EventTarget & HTMLFormElement): T {
    return Object.fromEntries((new FormData(form)).entries()) as T;
}