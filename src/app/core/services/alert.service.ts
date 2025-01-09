import { Injectable, signal } from '@angular/core';
import { Alert } from '@/core/models';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alerts = signal<Alert[]>([]);

  showAlert(message: string, type: Alert['type'] = 'success') {
    this.alerts.update((alerts) => [...alerts, { message, type }]);
    setTimeout(() => {
      this.removeAlert(message);
    }, 3000);
  }

  private removeAlert(message: string) {
    this.alerts.update((alerts) =>
      alerts.filter((alert) => alert.message !== message)
    );
  }

  getAlerts() {
    return this.alerts;
  }
}
