import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgIconsModule } from '@ng-icons/core';
import { featherChevronRight, featherBell, featherCheck, featherX, featherLogOut, featherSearch, featherPhone,
         featherSmartphone, featherMapPin } from '@ng-icons/feather-icons';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgIconsModule.withIcons({featherChevronRight, featherBell, featherCheck, featherX, featherLogOut, featherSearch, featherPhone,
        featherSmartphone, featherMapPin})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
