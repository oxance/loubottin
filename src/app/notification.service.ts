import { animate, style, transition, trigger } from '@angular/animations';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Notifications = NotificationRef[];
export type Notification = {
    message: string
    icon?: string
    state?: 'pending' | 'success' | 'warn'
}

export class NotificationRef implements Notification {

    private readonly onClose: (id: string) => void
    
    id: string
    message: string
    icon?: string
    state?: 'pending' | 'success' | 'warn'

    constructor(notification: Notification, onClose: (id: string) => void) {
        this.id = crypto.randomUUID();
        this.message = notification.message;
        this.onClose = onClose;
        this.set(notification);
    }

    set(notification: Partial<Notification>): NotificationRef {
        
        if(notification.state)
            this.state = notification.state;

        return this;
    }

    close(): void { this.onClose(this.id); }
}

export const notificationAnimations = [
    trigger('notification', [
        transition(':enter', [
            style({height: 0, opacity: 0, scale: .8, margin: '0 0 0 0'}),
            animate('250ms cubic-bezier(0, 0, 0.2, 1)', style({height: '*', opacity: 1, scale: 1, margin: '0 0 1rem 0'}))
        ]),
        transition(':leave', [
            style({height: '*', opacity: 1, margin: '0 0 1rem 0'}),
            animate('250ms linear', style({height: 0, opacity: 0, margin: '0 0 0 0'}))
        ])
    ])
]

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

    private readonly notifications: Notifications = [];
    private readonly notificationsChange: BehaviorSubject<Notifications> = new BehaviorSubject(this.notifications);

    readonly onNotificationsChange: Observable<Notifications> = this.notificationsChange.asObservable();

    open(notification: Notification): NotificationRef {

        const notificationRef = new NotificationRef(
            notification, 
            id => this.notifications.splice(this.notifications.findIndex(n => n.id === id), 1)
        );

        this.notifications.push(notificationRef);
        return notificationRef;
    } 
}
