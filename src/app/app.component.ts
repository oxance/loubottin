import { Component, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, Contact } from './api.service';
import { Session } from '@supabase/supabase-js';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

    session: Session | null = null;

    signInForm: FormGroup = this.form.group({
        email: [, Validators.email],
        password: [, Validators.required]    
    });

    searchForm: FormGroup = this.form.group({
        terms: []
    });

    contacts?: Contact[];
    currentContact?: Partial<Contact>;

    @ViewChild('notificationsTemplate') notificationsTemplateRef?: TemplateRef<any>;

    @HostListener('window:focus') onFocus(): void {

        this.getSession();
    }

    constructor(private readonly api: ApiService,
                private readonly form: FormBuilder) {

        this.getSession();

        this.api.getContacts().then(contacts => this.contacts = contacts);

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

    getSession() {
        this.api.getSession().then(({session}) => this.session = session);
    }

    signIn() {
        
        if(this.signInForm.valid) 
            this.api.signIn(this.signInForm.value).then(({session}) => this.session = session);
    }

    signOut() {

        this.api.signOut().then(() => this.session = null);
    }

    trackById(_index: number, item: {id: string}) {
        return item.id;
    }
}
