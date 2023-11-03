import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  }   from '@angular/forms';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { 
    LucideAngularModule, ChevronRight, LogOut, Search, X, Building, UserCheck2, CheckSquare, MapPin, Smartphone, Phone, Loader, AlertTriangle, CheckCircle,
    Save, Plus, Trash2
} from 'lucide-angular';
import { UpdatePasswordComponent } from './update-password/update-password.component';
// import { UpdateContactComponent } from './update-contact/update-contact.component';
import { AppRoutingModule } from './app-routing.module';
import { ContactsComponent } from './contacts/contacts.component';
import { NotificationModule } from './notification/notification.module';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    UpdatePasswordComponent,
    // UpdateContactComponent,
    ContactsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NotificationModule,
    LucideAngularModule.pick({
        ChevronRight, LogOut, Search, X, Building, UserCheck2, CheckSquare, MapPin, Smartphone, Phone, Loader, AlertTriangle, CheckCircle,
        Save, Plus, Trash2
    }),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
