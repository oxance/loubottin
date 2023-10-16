import { Injectable, OnDestroy } from '@angular/core';
import { SupabaseClient, createClient, SignInWithPasswordCredentials, PostgrestError, AuthChangeEvent, Session, Subscription, UserAttributes } from '@supabase/supabase-js';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Database } from 'types/supabase';

type NullablePartial<T> = { [P in keyof T]?: T[P] | null };

export type Contact = Database['public']['Tables']['contacts']['Row'];

@Injectable({
  providedIn: 'root'
})
export class ApiService implements OnDestroy {

    private supabase: SupabaseClient = createClient<Database>(environment.supabaseUrl, environment.supabaseKey);

    private authState: Subject<{event: AuthChangeEvent, session: Session | null}> = new Subject();
    private authStateSubscription: Subscription = this.supabase.auth.onAuthStateChange((event, session) => this.authState.next({event, session}))
                                                      .data.subscription;

    authStateChange: Observable<{event: AuthChangeEvent, session: Session | null}> = this.authState.asObservable();

    getContacts() {
        return this.cache('contacts', this.wrap<Contact[]>(this.supabase.from('contacts').select()));
    }

    signIn(credentials: SignInWithPasswordCredentials) {
        return this.wrap(this.supabase.auth.signInWithPassword(credentials));
    }

    signOut() {
        return this.wrap(this.supabase.auth.signOut());
    }

    updateUser(attributes: UserAttributes) {
        return this.wrap(this.supabase.auth.updateUser(attributes));
    }

    private wrap<T>(request: PromiseLike<{data?: NullablePartial<T> | null, error: PostgrestError | Error | null}>): Promise<T> {
        return request.then(({error, data}) => {

            if(error)
                alert(error.message);

            return data as T;
        }) as Promise<T>;
    }

    private cache<T>(key: string, wrappedRequest: Promise<T>): Promise<T> {
        
        const data = localStorage.getItem(key);

        return data ?
            new Promise<T>(r => r(JSON.parse(data))):
            wrappedRequest.then(data => {localStorage.setItem(key, JSON.stringify(data)); return data;});
    }

    ngOnDestroy(): void {
        this.authStateSubscription.unsubscribe();
    }
}
