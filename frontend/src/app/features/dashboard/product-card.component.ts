import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../core/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
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
          <div style="display: flex; gap: 8px; margin-top: 8px; align-items: center; flex-wrap: wrap;">
            <span style="font-size: 12px; padding: 2px 8px; background: {{ statusColor }}; color: white; border-radius: 4px;">
              {{ statusLabel }}
            </span>
            @if (product.lastCheckedAt) {
              <span style="font-size: 12px; color: #666;">
                Checked: {{ product.lastCheckedAt | date:'medium' }}
              </span>
            }
          </div>
          <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn" style="background: #2196f3; color: white;" (click)="viewDetails()">View Details</button>
            <button class="btn" style="background: #ff9800; color: white;" (click)="togglePause()">
              {{ product.status === 'paused' ? 'Resume' : 'Pause' }}
            </button>
            <button class="btn" style="background: #f44336; color: white;" (click)="delete.emit(product.id)">Delete</button>
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

  get statusLabel(): string {
    return this.productService.getStatusLabel(this.product.status);
  }

  get statusColor(): string {
    return this.productService.getStatusColor(this.product.status);
  }

  viewDetails() {
    this.router.navigate(['/product', this.product.id]);
  }

  togglePause() {
    const newStatus = this.product.status === 'paused' ? 'active' : 'paused';
    this.productService.update(this.product.id, { status: newStatus }).subscribe({
      next: (updated) => {
        this.product.status = updated.status;
      }
    });
  }
}
