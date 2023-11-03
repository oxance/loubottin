import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationRef, NotificationService, Notifications, notificationAnimations } from './notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  animations: notificationAnimations
})
export class NotificationsComponent implements OnDestroy {
    
    private readonly subscriptions: Subscription = new Subscription();
    
    notifications?: Notifications;

    constructor(private readonly notification: NotificationService) {
        this.subscriptions.add(
            this.notification.onNotificationsChange.subscribe(notifications =>
                this.notifications = notifications    
            )
        );
    }

    trackById(_index: number, item: NotificationRef) {
        return item.id;
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
