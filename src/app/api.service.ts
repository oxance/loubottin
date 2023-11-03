import { Injectable, OnDestroy } from '@angular/core';
import { SupabaseClient, createClient, SignInWithPasswordCredentials, PostgrestError, AuthChangeEvent, Session, Subscription, UserAttributes } from '@supabase/supabase-js';
import { Observable, Subject, from, map, of, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Database } from 'types/database';
import { Notification } from './notification/notification.module';

type NullablePartial<T> = { [P in keyof T]?: T[P] | null };

export type State = { pending: boolean };
export type Tag = { icon: string };
export type TagName = 'établissement' | 'salarié';
export type Tags = Record<TagName, Tag>;
export type Team = Database['public']['Tables']['teams']['Row'];
export type Contact = Database['public']['Tables']['contacts']['Row'];
export type SearchForm = {terms?: string, tags?: TagName[]};

@Injectable({
  providedIn: 'root'
})
export class ApiService implements OnDestroy {

    private supabase: SupabaseClient = createClient<Database>(environment.supabaseUrl, environment.supabaseKey);
    
    private authState: Subject<{event: AuthChangeEvent, session: Session | null}> = new Subject();
    private authStateSubscription: Subscription = this.supabase.auth.onAuthStateChange((event, session) => this.authState.next({event, session})).data.subscription;
    readonly authStateChange: Observable<{event: AuthChangeEvent, session: Session | null}> = this.authState.asObservable().pipe(shareReplay());

    tags: Tags = {
        établissement: {icon: 'building'},
        salarié: {icon: 'user-check-2'}
    }

    constructor(private readonly notification: Notification) {}

    getSession() {
        return this.wrap(this.supabase.auth.getSession());
    }

    getContacts(search?: SearchForm) {

        let query = this.supabase.from('contacts').select();

        if(search?.terms && search.terms.length > 2) {

            /**
             * Vector & partial search
             * 
             * create or replace function full_text(contacts) returns text as $$
             *  select trim(
             *          $1.name || ' ' || unaccent($1.name)
             *          || ' ' || coalesce($1.address, '') || ' ' || unaccent(coalesce($1.address, ''))
             *          || ' ' || coalesce($1.mobile, '')
             *          || ' ' || coalesce($1.phone, '')
             *          || ' ' || coalesce($1.mail, '')
             *  );
             *  $$ language sql immutable;
             */

            const terms = search.terms.trim().replace(/\s+/g, ' ').split(/\s/g).map(s => `'${s}':*`).join(' & ');
            query = query.textSearch('full_text', terms);
        }

        if(search?.tags && search.tags.length > 0)
            query = query.contains('tags', search.tags);

        return this.wrap<Contact[]>(query.order('name'));
    }

    setContact(contact: Contact) {
        const values = Object.fromEntries(Object.entries(contact).filter(([_, v]) => v));
        return this.wrap(this.supabase.from('contacts').upsert(values).select());
    }

    deleteContact(id: string) {
        return this.wrap(this.supabase.from('contacts').delete().eq('id', id));
    }

    getTeams() {
        return this.wrap<Team[]>(this.supabase.from('teams').select());
    }

    signIn(credentials: SignInWithPasswordCredentials) {
        return this.wrap(this.supabase.auth.signInWithPassword(credentials));
    }

    signOut() {
        return this.wrap(this.supabase.auth.signOut());
    }

    setUser(attributes: UserAttributes) {
        return this.wrap(this.supabase.auth.updateUser(attributes));
    }

    private wrap<T>(
        request: PromiseLike<{data?: NullablePartial<T> | null, error: PostgrestError | Error | null}>,
        options: {cache?: string} = {}
    ): Observable<T> {

        if(options.cache) {
            const data = localStorage.getItem(options.cache);

            if(data)
                return of<T>(JSON.parse(data));
        }

        return from(request).pipe(map(({error, data}) => {

            if(error)
                this.notification.open({message: error.message, state: 'warn'});

            if(data && options.cache)
                localStorage.setItem(options.cache, JSON.stringify(data));

            return data as T;
        }));
    }

    ngOnDestroy(): void {
        this.authStateSubscription.unsubscribe();
    }
}
