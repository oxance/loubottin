import { useSupabase } from "./Supabase"
import { ChevronRight, Loader } from "lucide-react";
import { FormEventHandler, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "./components/Speech";
import logo from './assets/logo.png';


export default function Auth() {

    const [ pending, setPending ] = useState(false);
    const { supabase, session } = useSupabase();

    const signIn: FormEventHandler<HTMLFormElement> = async event => {
        event.preventDefault();
        
        setPending(true);

        const {email, password} = Object.fromEntries((new FormData(event.currentTarget)).entries()) as {email: string, password: string};

        try {

            const { error } = await supabase.auth.signInWithPassword({email, password});

            if(error)
                throw error;   
        }
        catch(error: unknown) { toast.error((error as Error).message, {id: 'auth-error'}); }
        finally { setPending(false); }
    }

    return <>
        <Dialog dismissible={false} open={!session}>
            <DialogContent className="flex flex-col items-center">
                <img src={logo} loading="lazy" className="w-60 rounded-full" />
                <div className="relative whitespace-nowrap">
                    <div className="font-loubottin text-4xl text-oultine text-slate-950">Loup Bottin</div>
                    <div className="relative font-loubottin text-4xl text-primary-400">Loup Bottin</div>
                </div>
                <DialogTitle>Connectez-vous à votre compte</DialogTitle>
                <form onSubmit={signIn} className="flex flex-col items-start gap-6">
                    <input disabled={pending} name="email" type="email" placeholder="Adresse email" />
                    <input disabled={pending} name="password" type="password" placeholder="Mot de passe" />
                    <button type="submit" className="place-self-center overflow-hidden" disabled={pending}>
                        <Loader className={`animate-loader transition-all ${pending ? 'mr-1' : '-ml-9 mr-3'}`} />
                        Connection
                        <ChevronRight className={`transition-all ${pending ? '-mr-9 ml-3' : 'ml-1'}`} />
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    </>
}
