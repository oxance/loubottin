import { NgModule, inject } from '@angular/core';
import { CanActivateFn, Route, Router, RouterModule, Routes } from '@angular/router';
import { map } from 'rxjs';
import { SigninComponent } from './signin/signin.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ApiService } from './api.service';
import { UpdatePasswordComponent } from './update-password/update-password.component';

const isSignedIn: CanActivateFn = (_, state) => {
    const router = inject(Router);
    return inject(ApiService).getSession().pipe(
        map(({session}) => !!session || router.createUrlTree(['/signin', {return: decodeURIComponent(state.url)}]))
    );
};

const routeGuard: Partial<Route> = {canActivate: [isSignedIn], runGuardsAndResolvers: 'always'};

const routes: Routes = [
    {path: '', component: ContactsComponent, pathMatch: 'full', ...routeGuard},
    {path: 'signin', component: SigninComponent},
    {path: 'update-password', component: UpdatePasswordComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
