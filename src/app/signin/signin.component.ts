import { Component } from '@angular/core';
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
        password: [, Validators.required]    
    });

    state: State = {pending: false};

    constructor(private readonly api: ApiService,
                private readonly form: FormBuilder) {}

    signIn() {
        if(this.signInForm.valid) {
            this.state.pending = true;
            this.api.signIn(this.signInForm.value).subscribe(() => this.state.pending = false);
        }
    }
}
