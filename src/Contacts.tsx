import { useState } from "react";
import { Database } from "./supabase.types";
import { useSupabase } from "./Supabase";
import { AtSign, Edit, MapPin, Phone, Plus, Save, Smartphone, Trash2, UserPlus2, UserRoundSearch } from "lucide-react";
import { Search } from "./App";
import { toast } from "sonner";
import { contactsTags, Tag } from './tags';
import { SubmitHandler, useForm } from "react-hook-form";
import { Confirm, ConfirmContent, ConfirmTrigger } from "./components/Confirm";
import { Chips } from "./components/Chips";
import useSWR from "swr";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from "./components/Speech";

export type Contacts = Database['public']['Tables']['contacts']['Row'];
export type ContactsUpdate = Database['public']['Tables']['contacts']['Update'];

export default function Contacts({search}: {search?: Search}) {

    const { supabase, roles } = useSupabase();

    const {data: contacts = [], mutate, isValidating: isValidatingContacts} = useSWR<Contacts[] | null, Error>(['contacts', search], async () => {

        let query = supabase.from('contacts').select();

        if(search?.terms && search.terms.length > 2) 
            query = query.textSearch('full_text', search.terms.trim().replace(/\s+/g, ' ').split(/\s/g).map(s => `'${s}':*`).join(' & '));

        if(search?.tags && search.tags.length > 0)
            query = query.contains('tags', search.tags);

        const {data, error} = await query.order('name');

        if(error)
            toast(error.message, {id: 'search-error'});

        return data;
    }, {
        onErrorRetry: (_error, _key, _config, revalidate, {retryCount}) => {
        
            if(retryCount >= 5)
                return;
            
            setTimeout(() => revalidate({retryCount}), 5000);
        }
    });

    const { handleSubmit, register, reset, watch, formState: {errors}} = useForm<ContactsUpdate>();
    const isUpdating = watch('id');

    const [ currentContact, setCurrentContact ] = useState<ContactsUpdate>();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const openEdit = ({created_at, updated_by, ...contact}: ContactsUpdate) => {
        setCurrentContact(contact);
        reset(() => contact);
    }

    const cancelEdit = () => {
        reset(() => ({}));
        setCurrentContact(undefined);
    }

    const onUpdate: SubmitHandler<ContactsUpdate> = async contact => {
        const values = Object.fromEntries(Object.entries(contact).filter(([, v]) => v));
        
        const {error} = await supabase.from('contacts').upsert(values).select();

        if(error)
            toast.error(error.message, {id: 'set-contact-error'});
        else
            setCurrentContact(undefined);
        
        mutate();
    }

    const remove = async (id?: string) => {

        const {error} = await supabase.from('contacts').delete().eq('id', id!);

        if(error)
            toast.error(error.message, {id: 'set-contact-error'});
        else
            setCurrentContact(undefined);

        mutate();
    }

    return <div className="flex flex-wrap gap-4">
        {contacts?.length === 0 && !isValidatingContacts && <div className="flex-1 flex flex-col items-center my-12 min-w-full text-slate-500">
            <UserRoundSearch className="size-8" />
            Pas de résultats, essayez d'autres critères de recherche...
        </div>}
        {roles.includes('admin') && <div onClick={() => openEdit({})} className="flex-auto w-60 p-4 flex flex-col items-center justify-center cursor-pointer transition-all
            bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg text-slate-600
            hover:text-primary-500 hover:border-primary-500">
            <UserPlus2 className="size-8" />
            <div className="text-sm">Nouveau contact</div>
        </div>}
        {contacts?.length === 0 && isValidatingContacts ?
            [0, 1, 3, 4].map(k => <div key={k} className="flex-auto w-60 p-4 bg-slate-800 rounded-lg animate-pulse">
                <div className="w-48 h-6 rounded-full bg-slate-700"></div>
                <div className="w-16 h-4 rounded-full bg-slate-700 mt-2"></div>
                <div className="w-56 h-4 rounded-full bg-slate-700 mt-2"></div>
                <div className="w-44 h-4 rounded-full bg-slate-700 mt-2"></div>
            </div>):
            contacts?.map(contact => <div key={contact.id} 
                className={`relative group flex-auto w-60 p-4 bg-slate-800 rounded-lg ${isValidatingContacts ? 'animate-pulse' : ''}`}>
                <div className="font-semibold">
                    {contact.name}
                    {roles.includes('admin') && 
                        <button className="absolute top-3 right-3 button-ghost -mt-2 -mr-2 self-start text-slate-500 hidden group-hover:block animate-in fade-in" 
                            onClick={() => openEdit(contact)}><Edit /></button>}
                </div>
                <div className="flex gap-2 mb-4">
                    {contact.tags?.map(tag => {
                        const {icon: Icon, className} = contactsTags[tag as Tag];
                        return <Chips key={tag} name="tags" className={`border-none ${className}`}><Icon /> {tag}</Chips>
                    })}
                </div>
                <div className="grid grid-cols-[24px_minmax(0,_1fr)] gap-2 text-sm text-slate-400">
                    {contact.address && <><MapPin className="size-5" /><span>{contact.address}</span></>}
                    {contact.mail    && <><AtSign className="size-5" /><span>{contact.mail}</span></>}
                    {contact.mobile  && <><Smartphone className="size-5" /><span>{contact.mobile}</span></>}
                    {contact.phone   && <><Phone className="size-5" /><span>{contact.phone}</span></>}
                </div>
            </div>)
        }
        {roles.includes('admin') && <Dialog open={!!currentContact} onOpenChange={open => !open && cancelEdit() }>
            <DialogContent>
                <DialogTitle>{isUpdating ? 'Mettre à jour' :  'Ajouter'} {currentContact?.name}</DialogTitle>
                <form onSubmit={handleSubmit(onUpdate)} className="flex flex-col gap-4 w-full">
                    <div className="flex gap-2">
                        {Object.entries(contactsTags)?.map(([tagName, {icon: Icon, className}]) => {
                            return <Chips key={tagName} value={tagName} className={className} {...register("tags")}><Icon /> {tagName}</Chips>
                        })}
                    </div>
                    <input type="text" placeholder="Prénom et nom" {...register("name", {required: true})}
                        className={errors.name && "error"} />
                    <input type="text" placeholder="Adresse postale, code postal et ville" {...register("address")}  
                        className={errors.address && "error"} />
                    <input type="email" placeholder="Adresse Email" {...register("mail", {pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/})}  
                        className={errors.mail && "error"} />
                    <input type="tel" placeholder="Numéro de mobile" {...register("mobile", {pattern: /^[0-9]{10}$/})}  
                        className={errors.mobile && "error"} />
                    <input type="tel" placeholder="Numéro de téléphone" {...register("phone", {pattern: /^[0-9]{10}$/})}  
                        className={errors.phone && "error"} />
                    <DialogFooter>
                        {currentContact?.id && <Confirm>
                            <ConfirmTrigger asChild>
                                <button type="button" className="button-ghost error"><Trash2 /> Supprimer</button>
                            </ConfirmTrigger>
                            <ConfirmContent onConfirm={() => remove(currentContact.id)} className="bg-slate-800 border-2 border-red-500" 
                                classNames={{
                                    arrow: "fill-red-500 w-4 h-2"
                                }}>
                                <div className="flex items-center gap-2 text-red-500 font-semibold">
                                    Etes vous sur de vouloir supprimer {currentContact.name} ?
                                </div>
                            </ConfirmContent>
                        </Confirm>}
                        <div className="flex-1"></div>
                        <div className="ml-auto flex gap-4">
                            <DialogClose asChild>
                                <button type="button" className="button-ghost" >Annuler</button>
                            </DialogClose>
                            <button type="submit" className="success">
                                {isUpdating ? <><Save /> Enregistrer</> : <><Plus /> Ajouter</>}
                            </button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>}
    </div>
}