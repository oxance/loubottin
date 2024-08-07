import { getFormData, useHandler, useSupabase } from "./Supabase"
import { ChevronRight, Loader } from "lucide-react";
import { FormEventHandler } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "./components/Speech";
import logo from './assets/logo.png';


export default function Auth() {

    const { supabase, session, state } = useSupabase();

    const [signIn, isPending] = useHandler<FormEventHandler<HTMLFormElement>>(
        async event => {
            event.preventDefault();
            const {email, password} = getFormData<{email: string, password: string}>(event.currentTarget);
            const { error } = await supabase.auth.signInWithPassword({email, password});
            if(error) throw error;
        },
        ({message}) => toast.error(message, {id: 'auth-error'})
    );

    const [updatePassword, isUpdating] = useHandler<FormEventHandler<HTMLFormElement>>(
        async event => {
            event.preventDefault();
            const {password, passwordConfirm} = getFormData<{password: string, passwordConfirm: string}>(event.currentTarget);

            if(password !== passwordConfirm)
                throw new Error("Les mots de passe ne correspondent pas.");

            const { error } =  await supabase.auth.updateUser({password});

            if(error) throw error;
        },
        ({message}) => toast.error(message, {id: 'auth-error'})
    );

    return <>
        <Dialog dismissible={false} open={state.ready && (!session || state.recovery)}>
            <DialogContent className="flex flex-col items-center">
                <img src={logo} loading="lazy" className="w-60 rounded-full" />
                <div className="relative whitespace-nowrap">
                    <div className="font-loubottin text-4xl text-oultine text-slate-950">Loup Bottin</div>
                    <div className="relative font-loubottin text-4xl text-primary-400">Loup Bottin</div>
                </div>

                {state.recovery ? <>
                    <DialogTitle>Reinitialiser votre mot de passe</DialogTitle>
                    <form onSubmit={updatePassword} className="flex flex-col items-start gap-6">
                        <input disabled={isUpdating} name="password" type="password" placeholder="Nouveau mot de passe" className="w-full" />
                        <input disabled={isUpdating} name="passwordConfirm" type="password" placeholder="Confirmer le mot de passe" className="w-full" />
                        <button type="submit" className="place-self-center overflow-hidden" disabled={isUpdating}>
                            <Loader className={`animate-loader transition-all ${isUpdating ? 'mr-1' : '-ml-9 mr-3'}`} />
                            Mettre à jour le mot de passe
                            <ChevronRight className={`transition-all ${isUpdating ? '-mr-9 ml-3' : 'ml-1'}`} />
                        </button>
                    </form>
                </> : <>
                    <DialogTitle>Connectez-vous à votre compte</DialogTitle>
                    <form onSubmit={signIn} className="flex flex-col items-start gap-6">
                        <input disabled={isPending} name="email" type="email" placeholder="Adresse email" className="w-full" />
                        <input disabled={isPending} name="password" type="password" placeholder="Mot de passe" className="w-full" />
                        <button type="submit" className="place-self-center overflow-hidden" disabled={isPending}>
                            <Loader className={`animate-loader transition-all ${isPending ? 'mr-1' : '-ml-9 mr-3'}`} />
                            Connection
                            <ChevronRight className={`transition-all ${isPending ? '-mr-9 ml-3' : 'ml-1'}`} />
                        </button>
                    </form>
                </>}
            </DialogContent>
        </Dialog>
    </>
}
