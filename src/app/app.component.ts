import { Component, ElementRef, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService, Contact, SearchFormControls, TagName, Tags } from './api.service';
import { Session } from '@supabase/supabase-js';
import { Subscription, debounceTime, distinctUntilChanged, finalize, mergeMap } from 'rxjs';
import { NotificationService, Notifications, notificationAnimations } from './notification.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    animations: notificationAnimations
})
export class AppComponent implements OnDestroy {

    private subscriptions: Subscription = new Subscription();

    notifications?: Notifications;

    session: Session | null = null;

    searchForm: FormGroup<SearchFormControls> = new FormGroup({
        terms: new FormControl<string>(''),
        tags: new FormControl<TagName[]>([])
    } as SearchFormControls);

    tags?: Tags;
    contacts?: Contact[];

    @ViewChild('notificationsTemplate') notificationsTemplateRef?: TemplateRef<any>;

    constructor(private readonly api: ApiService,
                private readonly notification: NotificationService, 
                private readonly elementRef: ElementRef<HTMLElement>) {

        this.tags = this.api.tags;

        this.subscriptions.add(
            this.notification.onNotificationsChange.subscribe(notifications =>
                this.notifications = notifications    
            )
        );

        this.subscriptions.add(
            this.api.authStateChange.subscribe(({event, session}) => {

                switch(event) {
                    case 'PASSWORD_RECOVERY':
                        const newPassword = prompt("New password ?") as string;
                        this.api.updateUser({password: newPassword});
                    break;

                    default:
                        this.session = session;
                        break;
                }

                if(this.session)
                    this.searchForm.reset({}, {emitEvent: true});
            })
        );

        this.subscriptions.add(
            this.searchForm.valueChanges.pipe(
                distinctUntilChanged(),
                debounceTime(500),
                mergeMap(filters => {
                    const notificationRef = this.notification.open({message: 'search', state: 'pending'});
                    return this.api.getContacts(filters).pipe(finalize(() => notificationRef.close()))
                })
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

        setTimeout(() => {
            this.elementRef.nativeElement.querySelectorAll<HTMLElement>('.contact.invisible').forEach((e, i) => {

                if(e.offsetTop <= window.innerHeight)
                    setTimeout(() => {
                        e.classList.remove('invisible')
                    }, 50 * i);
                else
                    e.classList.remove('scale-in', 'invisible');
            });
        }, 100);
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
