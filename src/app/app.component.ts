import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService, Contact, SearchFormControls, State, TagName, Tags } from './api.service';
import { Session } from '@supabase/supabase-js';
import { Subscription, debounceTime, distinctUntilChanged, mergeMap, tap } from 'rxjs';
import { NotificationService, Notifications, notificationAnimations } from './notification.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    animations: notificationAnimations
})
export class AppComponent implements OnDestroy {

    private subscriptions: Subscription = new Subscription();

    page?: 'updatePassword'; 

    notifications?: Notifications;

    session: Session | null = null;

    searchForm: FormGroup<SearchFormControls> = new FormGroup({
        terms: new FormControl<string>(''),
        tags: new FormControl<TagName[]>([])
    } as SearchFormControls);

    tags?: Tags;
    contacts?: Contact[];

    state: State = {pending: false};

    constructor(private readonly api: ApiService,
                private readonly notification: NotificationService) {

        this.tags = this.api.tags;

        this.subscriptions.add(
            this.notification.onNotificationsChange.subscribe(notifications =>
                this.notifications = notifications    
            )
        );

        this.subscriptions.add(
            this.api.authStateChange.subscribe(({event, session}) => {

                this.session = session;

                switch(event) {

                    case 'PASSWORD_RECOVERY':
                        this.page = 'updatePassword';
                    break;

                    case 'USER_UPDATED':
                        if(this.page === 'updatePassword')
                            delete this.page;
                    break;

                    case 'SIGNED_IN':
                        this.searchForm.reset({}, {emitEvent: true});
                        break;
                }
            })
        );

        this.subscriptions.add(
            this.searchForm.valueChanges.pipe(
                distinctUntilChanged(),
                debounceTime(500),
                tap(() => this.state.pending = true),
                mergeMap(filters => this.api.getContacts(filters))
            ).subscribe(contacts => this.revealContacts(contacts))
        );
    }

    signOut() {
        this.api.signOut();
    }

    trackById(_index: number, item: {id: string}) {
        return item.id;
    }

    revealContacts(contacts: Contact[]) {
        this.contacts = contacts;
        this.state.pending = false;
    }

    toggleTagsFilter(tag: TagName) {

        const activeTags: TagName[] = this.searchForm.get('tags')?.value ?? [];

        if(activeTags.includes(tag))
            activeTags.splice(activeTags.indexOf(tag), 1);
        else
            activeTags.push(tag);

        this.searchForm.get('tags')?.setValue(activeTags);
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
