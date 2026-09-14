import { Component, OnInit } from '@angular/core';
import { TelegramService, TelegramBinding } from '../../core/telegram.service';

@Component({
  selector: 'app-telegram-settings',
  standalone: true,
  template: `
    <div class="container">
      <div class="card">
        <h2>Telegram Settings</h2>

        @if (loading) {
          <p>Loading...</p>
        } @else if (error) {
          <p style="color: #d32f2f;">{{ error }}</p>
        } @else {
          @if (status && status.isBound) {
            <div style="margin-bottom: 24px;">
              <p><strong>Status:</strong> <span style="color: #4caf50;">Connected</span></p>
              <p><strong>Telegram ID:</strong> {{ status.telegramUserId }}</p>
            </div>

            <button class="btn" style="background: #f44336; color: white;" (click)="unbind()">
              Disconnect Telegram
            </button>

            <button class="btn" style="background: #2196f3; color: white; margin-left: 8px;" (click)="test()">
              Test Notification
            </button>
          } @else {
            <div style="margin-bottom: 24px;">
              <p style="color: #ff9800;"><strong>Status:</strong> Not Connected</p>
              <p>To receive price drop notifications, connect your Telegram account:</p>
            </div>

            @if (bindingCode) {
              <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 4px;">Binding Code</label>
                <div style="display: flex; gap: 8px;">
                  <input type="text" [value]="bindingCode" readonly style="flex: 1; padding: 8px;" />
                  <button class="btn" (click)="copyCode()" style="background: #4caf50; color: white;">
                    Copy
                  </button>
                </div>
              </div>

              <div style="margin-bottom: 24px;">
                <strong>Binding Instructions:</strong>
                <ol style="margin: 8px 0; padding-left: 20px;">
                  <li>Open Telegram bot</li>
                  <li>Send: <code>/start {{ bindingCode }}</code></li>
                  <li>Return to web page</li>
                  <li>Check status (you may need to reload)</li>
                </ol>
              </div>
            }

            <button class="btn btn-primary" (click)="generateBindingCode()" [disabled]="loading || bindingCode">
              {{ bindingCode ? 'Binding Code Generated' : 'Generate Binding Code' }}
            </button>

            <button class="btn" style="background: #9e9e9e; color: white; margin-left: 8px;" (click)="unbind()">
              Clear Code
            </button>
          }
        }

        @if (message) {
          <p style="margin-top: 16px; color: #4caf50;">{{ message }}</p>
        }
      </div>
    </div>
  `
})
export class TelegramSettingsComponent implements OnInit {
  status: TelegramBinding | null = null;
  bindingCode: string = '';
  loading = false;
  error = '';
  message = '';

  constructor(private telegramService: TelegramService) {}

  ngOnInit() {
    this.loadStatus();
  }

  loadStatus() {
    this.loading = true;
    this.telegramService.getStatus().subscribe({
      next: (status) => {
        this.status = status;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load status';
        this.loading = false;
      }
    });
  }

  generateBindingCode() {
    this.loading = true;
    this.error = '';
    this.message = '';

    this.telegramService.bind().subscribe({
      next: (data) => {
        this.bindingCode = data.bindingCode;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to generate binding code';
        this.loading = false;
      }
    });
  }

  unbind() {
    if (!confirm('Are you sure you want to disconnect Telegram?')) return;

    this.loading = true;
    this.telegramService.unbind().subscribe({
      next: () => {
        this.bindingCode = '';
        this.loadStatus();
        this.message = 'Telegram disconnected successfully';
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to disconnect Telegram';
        this.loading = false;
      }
    });
  }

  async test() {
    this.loading = true;
    this.error = '';
    this.message = '';

    this.telegramService.test().subscribe({
      next: () => {
        this.message = 'Test notification sent! Check your Telegram.';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to send test notification';
        this.loading = false;
      }
    });
  }

  async copyCode() {
    if (!this.bindingCode) return;

    try {
      await navigator.clipboard.writeText(this.bindingCode);
      this.message = 'Binding code copied to clipboard!';
    } catch {
      this.message = 'Failed to copy. Please select and copy manually.';
    }
  }
}
