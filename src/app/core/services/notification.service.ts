import { Injectable } from '@angular/core';
import { MatSnackBarRef, TextOnlySnackBar, MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import { generalNotificationDurationInMs, successNotificationDurationInMs } from '@core/config';

type Notification = { content: string, config: MatSnackBarConfig };
type NotificationTypes = 'info' | 'success' | 'warning' | 'error';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationQueue: Notification[] = [];
  private afterDismissedSubscription: Subscription | undefined;
  private lastSnackBarRef: MatSnackBarRef<TextOnlySnackBar> | undefined;
  
  constructor(private matSnackBar: MatSnackBar) { }

  ngOnDestroy() {
    if (this.afterDismissedSubscription) {
      this.afterDismissedSubscription.unsubscribe();
    }
  }

  openNotification(content: string, type: NotificationTypes): void {
    const config: MatSnackBarConfig = {
      duration: this.getNotificationDurationAccordingToType(type),
      panelClass: `${type}-snackbar`,
      horizontalPosition: 'center'
    };

    this.notificationQueue.push({ content, config });

    if (!this.lastSnackBarRef) {
      this.showNextNotification();
    }
  }

  private getNotificationDurationAccordingToType(type: NotificationTypes): number {
    return type === 'success' ? successNotificationDurationInMs : generalNotificationDurationInMs;
  }

  private showNextNotification(): void {
    if (this.notificationQueue.length === 0) {
      return;
    }

    const nextNotification = this.notificationQueue.shift();
    
    if (nextNotification) {
      this.lastSnackBarRef = this.matSnackBar.open(nextNotification.content, 'OK', nextNotification.config);
    }

    this.lastSnackBarRef?.afterDismissed()
      .subscribe(() => {
        this.lastSnackBarRef = undefined;
        this.showNextNotification();
      });
  }
}
