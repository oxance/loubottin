import { Component, OnDestroy } from '@angular/core';
import { ApiService, Contact, State, TagName, Tags } from '../api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged, mergeMap, tap } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { Notification } from '../notification/notification.module';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    animations: [
        trigger('panel', [
            transition(':enter', [
                style({opacity: 0, margin: '0 0 -200px 0'}),
                animate('250ms cubic-bezier(0, 0, 0.2, 1)', style({opacity: 1, margin: '0 0 0 0'}))
            ]),
            transition(':leave', [
                style({opacity: 1, margin: '0 0 0 0'}),
                animate('100ms linear', style({opacity: 0, margin: '0 0 -200px 0'}))
            ])
        ]),
        trigger('panelBackdrop', [
            transition(':enter', [
                style({opacity: 0}),
                animate('250ms cubic-bezier(0, 0, 0.2, 1)', style({opacity: 1}))
            ]),
            transition(':leave', [
                style({opacity: 1}),
                animate('100ms linear', style({opacity: 0}))
            ])
        ])
    ]
})
export class ContactsComponent implements OnDestroy {

    private readonly subscriptions: Subscription = new Subscription();

    tags?: Tags;

    searchForm: FormGroup = this.fb.group({
        terms: [],
        tags: []
    }) as FormGroup<{terms: FormControl<string | null>, tags: FormControl<TagName[] | null>}>;

    test?: Subscription = new Subscription();

    states: Record<'search' | 'setContact', State> = {
        search: {pending: false},
        setContact: {pending: false}
    };

    contacts?: Contact[];

    setContactForm: FormGroup = this.fb.group({
        id: [],
        name: [, Validators.required],
        address: [, Validators.required],
        mobile: [, [Validators.pattern(/[0-9]{10}/)]],
        phone: [, [Validators.pattern(/[0-9]{10}/)]],
        mail: [, [Validators.email]],
        tags: []
    });

    isSetContact: boolean = false;
    canSetContact: boolean = false;

    constructor(private readonly api: ApiService,
                private readonly fb: FormBuilder,
                private readonly notification: Notification) {

        this.tags = this.api.tags;

        this.subscriptions.add(
            this.api.authStateChange.subscribe(({event}) => {
                switch(event) {

                    case 'SIGNED_IN':
                        this.api.getTeams().subscribe(teams => this.canSetContact = teams.map(({role}) => role).includes('admin'));
                        break;
                }
            })
        );

        this.subscriptions.add(

            this.test = this.searchForm.valueChanges.pipe(
                distinctUntilChanged(),
                debounceTime(500),
                tap(() => this.states.search.pending = true),
                mergeMap(filters => this.api.getContacts(filters))
            ).subscribe(contacts => this.revealContacts(contacts))
        );
                    
        this.searchForm.reset({}, {emitEvent: true});
    }

    trackById(_index: number, item: {id: string}) {
        return item.id;
    }

    toggleTagsFilter(tag: TagName) {

        const activeTags: TagName[] = this.searchForm.get('tags')?.value ?? [];

        if(activeTags.includes(tag))
            activeTags.splice(activeTags.indexOf(tag), 1);
        else
            activeTags.push(tag);

        this.searchForm.get('tags')?.setValue(activeTags);
    }

    revealContacts(contacts: Contact[]) {
        this.contacts = contacts;
        this.states.search.pending = false;
    }

    setContact() {
        if(this.setContactForm.valid) {
            this.states.setContact.pending = true;
            this.api.setContact(this.setContactForm.value).subscribe(contacts => {
                this.isSetContact = false;
                this.states.setContact.pending = false;
                this.setContactForm.reset({}, {emitEvent: false});
                this.notification.open({message: 'Enregistré', state: 'success', during: 3000});

                contacts.forEach(contact => {

                    const index = this.contacts ? this.contacts.findIndex(({id}) => id === contact.id) : -1;

                    if(this.contacts && index > -1)
                        this.contacts[index] = contact;
                });
            });
        }
    }

    setContactTags(event: Event) {

        const target = event.target as HTMLInputElement;
        const tags = this.setContactForm.get('tags');
        const value = tags?.value ?? [];

        if(target.checked && !value.includes(target.value))
            tags?.setValue([...value, target.value]);
        else if(!target.checked && value.includes(target.value))
            tags?.setValue(tags.value.filter((v: TagName) => v !== target.value));
    }

    deleteContact(id: string) {

        this.notification.open({
            message: 'Êtes vous sûre de bien vouloir supprimer ce contact ?',
            state: 'warn',
            actions: [
                {text: 'Non', action: notificationRef => notificationRef.close()},
                {text: 'Oui', action: notificationRef => {
                    this.isSetContact = false;
                    this.setContactForm.reset({}, {emitEvent: false});

                    notificationRef.set({message: 'Suppression', state: 'pending'});

                    this.api.deleteContact(id).subscribe(() => {
                        notificationRef.set({message: 'Supprimé', state: 'success', during: 3000});
            
                        const index = this.contacts ? this.contacts.findIndex(c => c.id === id) : -1;
            
                        if(this.contacts && index > -1)
                            this.contacts.splice(index, 1);
                    });
                }},
            ]
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
