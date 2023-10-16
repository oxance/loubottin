import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  }   from '@angular/forms';
import { AppComponent } from './app.component';
import { NgIconsModule } from '@ng-icons/core';
import { featherChevronRight, featherBell, featherCheck, featherX, featherLogOut, featherSearch, featherPhone,
         featherSmartphone, featherMapPin } from '@ng-icons/feather-icons';
import { SigninComponent } from './signin/signin.component';

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
    NgIconsModule.withIcons({featherChevronRight, featherBell, featherCheck, featherX, featherLogOut, featherSearch, featherPhone,
        featherSmartphone, featherMapPin})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
