import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'app-alert-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="card" style="margin-top: 24px;">
      <h3>Alert Settings</h3>
      <form [formGroup]="form">
        <div style="margin-bottom: 16px;">
          <label style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" formControlName="isActive" />
            <span>Enable Alert</span>
          </label>
        </div>

        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 4px;">Alert Type</label>
          <select formControlName="alertType" style="width: 100%; padding: 8px;">
            <option value="any_drop">Any Price Drop</option>
            <option value="target_price">Target Price</option>
            <option value="min_drop_percentage">Minimum Drop %</option>
          </select>
        </div>

        @if (form.get('alertType')?.value === 'target_price') {
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px;">Target Price (IDR)</label>
            <input
              type="number"
              formControlName="targetPrice"
              style="width: 100%; padding: 8px;"
            />
            @if (form.get('targetPrice')?.touched && form.get('targetPrice')?.errors) {
              <small style="color: #d32f2f;">Target price is required for target_price alert</small>
            }
          </div>
        }

        @if (form.get('alertType')?.value === 'min_drop_percentage') {
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px;">Minimum Drop (%)</label>
            <input
              type="number"
              formControlName="minDropPercentage"
              step="0.1"
              style="width: 100%; padding: 8px;"
            />
            @if (form.get('minDropPercentage')?.touched && form.get('minDropPercentage')?.errors) {
              <small style="color: #d32f2f;">Minimum drop is required for min_drop_percentage alert</small>
            }
          </div>
        }

        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 4px;">Cooldown (minutes)</label>
          <input
            type="number"
            formControlName="cooldownMinutes"
            style="width: 100%; padding: 8px;"
          />
          <small style="color: #666;">Default: 360 minutes (6 hours)</small>
        </div>

        @if (error) {
          <p style="color: #d32f2f; margin-bottom: 16px;">{{ error }}</p>
        }

        <button
          type="button"
          class="btn btn-primary"
          (click)="onSave()"
          [disabled]="saving"
        >
          {{ saving ? 'Saving...' : 'Save Alert' }}
        </button>
      </form>
    </div>
  `
})
export class AlertSettingsComponent {
  form: FormGroup;
  saving = false;
  error = '';
  @Input() productId: string = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      isActive: [true],
      alertType: ['any_drop'],
      targetPrice: [null],
      minDropPercentage: [null],
      cooldownMinutes: [360]
    });
  }

  onSave() {
    this.saving = true;
    this.error = '';
    this.onSaved.emit(this.form.value);
  }
}
