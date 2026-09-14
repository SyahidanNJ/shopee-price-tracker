import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product, UpdateProductRequest } from '../../core/product.service';
import { AlertService, UpdateAlertRequest } from '../../core/alert.service';
import { AlertSettingsComponent } from './alert-settings.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [AlertSettingsComponent],
  template: `
    <div class="container">
      @if (loading) {
        <div class="card" style="text-align: center; padding: 40px;">
          <div>Loading...</div>
        </div>
      } @else if (error) {
        <div class="card" style="color: #d32f2f;">
          <strong>Error:</strong> {{ error }}
          <button class="btn btn-secondary" (click)="router.back()" style="margin-top: 16px;">Back</button>
        </div>
      } @else if (product) {
        <div class="card">
          <button class="btn btn-secondary" (click)="router.back()" style="margin-bottom: 16px;">← Back</button>
          
          @if (product.imageUrl) {
            <img [src]="product.imageUrl" [alt]="product.name" style="max-width: 200px; border-radius: 8px; margin-bottom: 16px;" />
          }

          <h2>{{ product.name }}</h2>
          @if (product.currentPrice) {
            <p style="font-size: 24px; font-weight: bold;">Rp {{ product.currentPrice.toLocaleString() }}</p>
          }

          <p style="margin: 16px 0;">
            <strong>Status:</strong> {{ getStatusLabel(product.status) }}
          </p>

          @if (product.lastCheckedAt) {
            <p>Last checked: {{ product.lastCheckedAt | date:'medium' }}</p>
          }

          <div style="margin-top: 24px;">
            <a [href]="product.sourceUrl" target="_blank" class="btn btn-primary">
              Open in Shopee
            </a>
            <button class="btn btn-secondary" (click)="togglePause()" style="margin-left: 8px;">
              {{ product.status === 'paused' ? 'Resume' : 'Pause' }}
            </button>
            <button class="btn" style="background: #f44336; color: white; margin-left: 8px;" (click)="confirmDelete()">
              Delete
            </button>
          </div>

          <app-alert-settings
            [productId]="product.id"
            (onSaved)="handleAlertSave($event)"
          ></app-alert-settings>
        </div>
      }
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private alertService: AlertService,
    private router: Router
  ) {}

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
        this.form.patchValue({
          isActive: alert.isActive,
          alertType: alert.alertType,
          targetPrice: alert.targetPrice,
          minDropPercentage: alert.minDropPercentage,
          cooldownMinutes: alert.cooldownMinutes
        });
      },
      error: () => {}
    });
  }

  getStatusLabel(status: string): string {
    return this.productService.getStatusLabel(status);
  }

  async togglePause() {
    if (!this.product) return;
    const newStatus = this.product.status === 'paused' ? 'active' : 'paused';
    await this.productService.update(this.product.id, { status: newStatus }).toPromise();
    this.product.status = newStatus;
  }

  confirmDelete() {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(this.product!.id).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: () => this.error = 'Failed to delete product'
      });
    }
  }

  async handleAlertSave(data: any) {
    if (!this.product) return;

    const request: UpdateAlertRequest = {
      isActive: data.isActive,
      alertType: data.alertType,
      targetPrice: data.alertType === 'target_price' ? data.targetPrice : null,
      minDropPercentage: data.alertType === 'min_drop_percentage' ? data.minDropPercentage : null,
      cooldownMinutes: data.cooldownMinutes
    };

    try {
      await this.alertService.update(this.product.id, request).toPromise();
      this.error = '';
    } catch (err: any) {
      this.error = err.error?.error || 'Failed to save alert';
    }
  }
}
