import { Component } from '@angular/core';
import { ApiService, State } from '../api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html'
})
export class UpdatePasswordComponent {

    updatePasswordForm: FormGroup = this.form.group({
        password: [, Validators.required]    
    });

    state: State = {pending: false};

    constructor(private readonly api: ApiService,
                private readonly form: FormBuilder,
                private readonly notification: NotificationService) {}

    updatePassword() {
        if(this.updatePasswordForm.valid) {
            this.state.pending = true;
            this.api.updateUser(this.updatePasswordForm.value).subscribe(({user}) => {

                this.state.pending = false;

                if(user)
                    this.notification.open({message: 'Mot de passe enregistré !', state: 'success', during: 3000});
            });
        }
    }
}
