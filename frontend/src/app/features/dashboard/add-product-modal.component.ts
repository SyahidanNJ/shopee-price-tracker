import { Component, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'app-add-product-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;" (click)="onClose()">
      <div class="card" style="max-width: 500px; width: 90%;" (click)="$event.stopPropagation()">
        <h2>Add Product</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px;">Shopee Product URL</label>
            <input
              type="url"
              formControlName="sourceUrl"
              placeholder="https://shopee.co.id/product-name.i.123456789"
              style="width: 100%; padding: 8px;"
            />
            @if (form.get('sourceUrl')?.touched && form.get('sourceUrl')?.errors) {
              <small style="color: #d32f2f;">
                @if (form.get('sourceUrl')?.errors?.['required']) { URL is required }
                @if (form.get('sourceUrl')?.errors?.['pattern']) { Must be a valid Shopee URL }
              </small>
            }
          </div>

          @if (error) {
            <p style="color: #d32f2f; margin-bottom: 16px;">{{ error }}</p>
          }

          <div style="display: flex; gap: 8px;">
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="form.invalid || loading"
            >
              {{ loading ? 'Adding...' : 'Add Product' }}
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              (click)="onClose()"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AddProductModalComponent {
  form: FormGroup;
  loading = false;
  error = '';
  @Output() closed = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      sourceUrl: ['', [Validators.required, Validators.pattern(/shopee\.co\.id/)]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.closed.emit(this.form.value);
  }

  onClose() {
    this.closed.emit();
  }
}
