import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnDestroy {

    private readonly subscriptions: Subscription = new Subscription();

    signedIn: boolean = false;

    constructor(private readonly router: Router,
                private readonly api: ApiService) {

        this.subscriptions.add(
            this.api.authStateChange.subscribe(({event, session}) => {
                switch(event) {

                    case 'PASSWORD_RECOVERY':
                        this.router.navigate(['/update-password']);
                        break;
                }

                this.signedIn = !!session;
            })
        );
    }

    signOut() {
        this.api.signOut().subscribe(() => this.router.navigate([this.router.url]));
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
