import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { LucideAngularModule, Loader, CheckCircle, AlertTriangle, X } from 'lucide-angular';
import { NotificationService } from './notification.service';

@NgModule({
  declarations: [
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    LucideAngularModule.pick({X, Loader, AlertTriangle, CheckCircle}),
  ],
  exports: [
    NotificationsComponent,
  ]
})
export class NotificationModule { }

export {NotificationService as Notification};