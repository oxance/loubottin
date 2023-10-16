import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html'
})
export class SigninComponent {

    signInForm: FormGroup = this.form.group({
        email: [, Validators.email],
        password: [, Validators.required]    
    });

    constructor(private readonly api: ApiService,
                private readonly form: FormBuilder) {}

    signIn() {
        
        if(this.signInForm.valid) 
            this.api.signIn(this.signInForm.value);
    }
}
