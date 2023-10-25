import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  }   from '@angular/forms';
import { AppComponent } from './app.component';
import { SigninComponent } from './signin/signin.component';
import { 
    LucideAngularModule, ChevronRight, LogOut, Search, X, Building, UserCheck2, CheckSquare, MapPin, Smartphone, Phone, Loader, AlertTriangle, Check
} from 'lucide-angular';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent
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
