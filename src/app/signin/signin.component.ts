import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { State } from '../api.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html'
})
export class SigninComponent {

    signInForm: FormGroup = this.form.group({
        email: [, Validators.email],
        password: []    
    });

    state: State = {pending: false};

    constructor(private readonly router: Router,
                private readonly route: ActivatedRoute,
                private readonly api: ApiService,
                private readonly form: FormBuilder) {}

    submit() {
        if(this.signInForm.valid) {
            this.state.pending = true;
            this.api.signIn(this.signInForm.value).subscribe(({session}) => {

                if(session)
                    this.router.navigate([this.route.snapshot.params['return']], {replaceUrl: true});
                
                this.state.pending = false
            });
        }
    }
}
