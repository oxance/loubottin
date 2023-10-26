import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  }   from '@angular/forms';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { 
    LucideAngularModule, ChevronRight, LogOut, Search, X, Building, UserCheck2, CheckSquare, MapPin, Smartphone, Phone, Loader, AlertTriangle, Check
} from 'lucide-angular';
import { UpdatePasswordComponent } from './update-password/update-password.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    UpdatePasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule.pick({
        ChevronRight, LogOut, Search, X, Building, UserCheck2, CheckSquare, MapPin, Smartphone, Phone, Loader, AlertTriangle, Check
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
