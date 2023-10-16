import { Injectable } from '@angular/core';
import { SupabaseClient, createClient, SignInWithPasswordCredentials, PostgrestError } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { Database } from 'types/supabase';

type NullablePartial<T> = { [P in keyof T]?: T[P] | null };

export type Contact = Database['public']['Tables']['contacts']['Row'];

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    private supabase: SupabaseClient = createClient<Database>(environment.supabaseUrl, environment.supabaseKey);

    getContacts() {
        
        const contacts = localStorage.getItem('contacts');

        return contacts ?
            new Promise<Contact[]>(resolve => resolve(JSON.parse(contacts))) :
            this.wrap<Contact[]>(this.supabase.from('contacts').select())
                .then(contacts => {
                    localStorage.setItem('contacts', JSON.stringify(contacts));
                    return contacts;
                });
    }

    getSession() {
        return this.wrap(this.supabase.auth.getSession());
    }

    signIn(credentials: SignInWithPasswordCredentials) {
        return this.wrap(this.supabase.auth.signInWithPassword(credentials));
    }

    signOut() {
        return this.wrap(this.supabase.auth.signOut());
    }

    private wrap<T>(request: PromiseLike<{data?: NullablePartial<T> | null, error: PostgrestError | Error | null}>): Promise<T> {
        return request.then(({error, data}) => {

            if(error)
                alert(error.message);

            return data as T;
        }) as Promise<T>;
    }
}
