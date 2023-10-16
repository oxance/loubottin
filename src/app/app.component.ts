import { Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService, Contact } from './api.service';
import { Session } from '@supabase/supabase-js';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnDestroy {

    private subscriptions: Subscription = new Subscription();

    session: Session | null = null;

    searchForm: FormGroup = this.form.group({
        terms: []
    });

    contacts?: Contact[];
    currentContact?: Partial<Contact>;

    @ViewChild('notificationsTemplate') notificationsTemplateRef?: TemplateRef<any>;

    constructor(private readonly api: ApiService,
                private readonly form: FormBuilder) {

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

                if(this.session) {
                    this.api.getContacts().then(contacts => this.contacts = contacts);
                } else {
                    delete this.contacts;
                }
            })
        );

        this.searchForm.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(500),
        ).subscribe(filters => {

            console.log(filters);

            this.api.getContacts().then(contacts => 
                this.contacts = contacts.filter(item => {

                    let a = true;

                    if(filters.terms) {
                        const termsSearch = new RegExp(filters.terms, 'i');

                        a = a && (
                            termsSearch.test((item.name ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '')) ||
                            termsSearch.test((item.address ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '')) ||
                            termsSearch.test((item.mobile ?? '').replace(' ', '')) ||
                            termsSearch.test((item.phone ?? '').replace(' ', ''))
                        );
                    }

                    return a;
                })
            );
        });
    }

    signOut() {
        this.api.signOut();
    }

    trackById(_index: number, item: {id: string}) {
        return item.id;
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
