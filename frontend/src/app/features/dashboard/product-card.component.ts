import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product, ProductService } from '../../core/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  template: `
    <div class="card" style="margin-bottom: 16px;">
      <div style="display: flex; gap: 16px;">
        @if (product.imageUrl) {
          <img [src]="product.imageUrl" [alt]="product.name" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;" />
        }
        <div style="flex: 1;">
          <h3 style="margin: 0 0 8px 0;">{{ product.name }}</h3>
          @if (product.currentPrice) {
            <p style="margin: 0; font-weight: bold;">Rp {{ product.currentPrice.toLocaleString() }}</p>
          }
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <span style="font-size: 12px; padding: 2px 8px; background: {{ getStatusColor(product.status) }}; color: white; border-radius: 4px;">
              {{ getStatusLabel(product.status) }}
            </span>
            @if (product.lastCheckedAt) {
              <span style="font-size: 12px; color: #666;">
                Checked: {{ product.lastCheckedAt | date:'medium' }}
              </span>
            }
          </div>
          <div style="margin-top: 12px;">
            <button class="btn" style="background: #2196f3; color: white; margin-right: 8px;" (click)="viewDetails()">
              View Details
            </button>
            <button class="btn" style="background: #ff9800; color: white; margin-right: 8px;" (click)="togglePause()">
              {{ product.status === 'paused' ? 'Resume' : 'Pause' }}
            </button>
            <button class="btn" style="background: #f44336; color: white;" (click)="onDelete.emit(product.id)">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() delete = new EventEmitter<string>();

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  getStatusLabel(status: string): string {
    return this.productService.getStatusLabel(status);
  }

  getStatusColor(status: string): string {
    return this.productService.getStatusColor(status);
  }

  viewDetails() {
    this.router.navigate(['/product', this.product.id]);
  }

  async togglePause() {
    const newStatus = this.product.status === 'paused' ? 'active' : 'paused';
    await this.productService.update(this.product.id, { status: newStatus }).toPromise();
    window.location.reload();
  }
}
