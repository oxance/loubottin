import { animate, style, transition, trigger } from '@angular/animations';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Notifications = NotificationRef[];
export type Notification = {
    message: string
    icon?: string
    state?: 'pending' | 'success' | 'warn'
    during?: number
    actions?: {text: string, icon?: string, action: (notificationRef: NotificationRef) => void}[]
}

export class NotificationRef implements Notification {

    private readonly onClose: (id: string) => void 

    id: string
    message: string
    icon?: string
    state?: 'pending' | 'success' | 'warn'
    actions?: {text: string, icon?: string, action: (notificationRef: NotificationRef) => void}[]

    private duringTimeout?: NodeJS.Timeout;

    constructor(notification: Notification, onClose: (id: string) => void) {
        this.id = crypto.randomUUID();
        this.message = notification.message;
        this.onClose = onClose;
        this.set(notification);
    }

    set(notification: Partial<Notification>): NotificationRef {

        if(notification.message)
            this.message = notification.message;

        if(notification.during)
            this.duringTimeout = setTimeout(() => this.close(), notification.during);
        else if(this.duringTimeout) {
            clearTimeout(this.duringTimeout);
            delete this.duringTimeout;
        }

        for(const property of ['state', 'actions'] as (keyof this)[]) {
            if(notification.hasOwnProperty(property))
                this[property] = notification[property as keyof Partial<Notification>] as this[keyof this];
            else if(this[property])
                delete this[property];
        }

        return this;
    }

    close(): void { this.onClose(this.id); }
}

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

export const notificationAnimations = [
    trigger('notification', [
        transition(':enter', [
            style({height: 0, opacity: 0, scale: .8}),
            animate('250ms cubic-bezier(0, 0, 0.2, 1)', style({height: '*', opacity: 1, scale: 1}))
        ]),
        transition(':leave', [
            style({height: '*', opacity: 1}),
            animate('100ms linear', style({height: 0, opacity: 0}))
        ])
    ]),
    trigger('grow', [
        transition('void <=> *', []),
        transition('* <=> *', [
            style({height: '{{startHeight}}px', opacity: '{{opacity}}'}), animate('250ms cubic-bezier(0, 0, 0.2, 1)')
        ], {params: {startHeight: 0, opacity: 0}})
    ])
];