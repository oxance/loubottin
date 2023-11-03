import { Component } from '@angular/core';
import { ApiService, State } from '../api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Notification } from '../notification/notification.module';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html'
})
export class UpdatePasswordComponent {

    updateForm: FormGroup = this.form.group({
        password: []    
    });

    state: State = {pending: false};

    constructor(private readonly router: Router,
                private readonly api: ApiService,
                private readonly form: FormBuilder,
                private readonly notification: Notification) {}

    submit() {
        if(this.updateForm.valid) {
            this.state.pending = true;
            this.api.setUser(this.updateForm.value).subscribe(({user}) => {

                this.state.pending = false;

                if(user) {
                    this.notification.open({message: 'Mot de passe enregistré !', state: 'success', during: 3000});
                    this.router.navigate(['/'], {replaceUrl: true});
                }
            });
        }
    }
}
