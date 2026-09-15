import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../core/product.service';
import { AlertService, Alert, UpdateAlertRequest } from '../../core/alert.service';
import { AlertSettingsComponent } from './alert-settings.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, AlertSettingsComponent],
  template: `
    <div class="container">
      @if (loading) {
        <div class="card" style="text-align: center; padding: 40px;">
          <div>Loading...</div>
        </div>
      } @else if (error) {
        <div class="card" style="color: #d32f2f;">
          <strong>Error:</strong> {{ error }}
          <div><button class="btn btn-secondary" (click)="goBack()" style="margin-top: 16px;">Back</button></div>
        </div>
      } @else if (product) {
        <div class="card">
          <button class="btn btn-secondary" (click)="goBack()" style="margin-bottom: 16px;">&larr; Back</button>

          @if (product.imageUrl) {
            <img [src]="product.imageUrl" [alt]="product.name" style="max-width: 200px; border-radius: 8px; margin-bottom: 16px;" />
          }

          <h2>{{ product.name }}</h2>
          @if (product.currentPrice) {
            <p style="font-size: 24px; font-weight: bold;">Rp {{ product.currentPrice.toLocaleString() }}</p>
          }

          <p style="margin: 16px 0;">
            <strong>Status:</strong> {{ statusLabel }}
          </p>

          @if (product.lastCheckedAt) {
            <p>Last checked: {{ product.lastCheckedAt | date:'medium' }}</p>
          }

          <div style="margin-top: 24px; display: flex; gap: 8px; flex-wrap: wrap;">
            <a [href]="product.sourceUrl" target="_blank" class="btn btn-primary">Open in Shopee</a>
            <button class="btn" style="background: #ff9800; color: white;" (click)="togglePause()">
              {{ product.status === 'paused' ? 'Resume' : 'Pause' }}
            </button>
            <button class="btn" style="background: #f44336; color: white;" (click)="confirmDelete()">Delete</button>
          </div>

          <app-alert-settings
            [alert]="alert"
            [saving]="savingAlert"
            [error]="alertError"
            (saved)="handleAlertSave($event)"
          ></app-alert-settings>
        </div>
      }
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  alert: Alert | null = null;
  loading = false;
  savingAlert = false;
  error = '';
  alertError = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private alertService: AlertService,
    private router: Router
  ) {}

  get statusLabel(): string {
    return this.product ? this.productService.getStatusLabel(this.product.status) : '';
  }

  goBack() {
    window.history.back();
  }

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (!productId) {
      this.error = 'Invalid product ID';
      return;
    }
    this.loadProduct(productId);
    this.loadAlert(productId);
  }

  loadProduct(productId: string) {
    this.loading = true;
    this.productService.getById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to load product';
        this.loading = false;
      }
    });
  }

  loadAlert(productId: string) {
    this.alertService.getByProductId(productId).subscribe({
      next: (alert) => {
        this.alert = alert;
      },
      error: () => {}
    });
  }

  togglePause() {
    if (!this.product) return;
    const newStatus = this.product.status === 'paused' ? 'active' : 'paused';
    this.productService.update(this.product.id, { status: newStatus }).subscribe({
      next: (updated) => {
        if (this.product) this.product.status = updated.status;
      }
    });
  }

  confirmDelete() {
    if (this.product && confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(this.product.id).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: () => (this.error = 'Failed to delete product')
      });
    }
  }

  handleAlertSave(data: any) {
    if (!this.product) return;

    this.savingAlert = true;
    this.alertError = '';

    const request: UpdateAlertRequest = {
      isActive: data.isActive,
      alertType: data.alertType,
      targetPrice: data.alertType === 'target_price' ? Number(data.targetPrice) : null,
      minDropPercentage: data.alertType === 'min_drop_percentage' ? Number(data.minDropPercentage) : null,
      cooldownMinutes: Number(data.cooldownMinutes) || 360
    };

    this.alertService.update(this.product.id, request).subscribe({
      next: (alert) => {
        this.alert = alert;
        this.savingAlert = false;
      },
      error: (err) => {
        this.alertError = err.error?.error || 'Failed to save alert';
        this.savingAlert = false;
      }
    });
  }
}
