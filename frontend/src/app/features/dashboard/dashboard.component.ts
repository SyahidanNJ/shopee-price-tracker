import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ProductService, Product } from '../../core/product.service';
import { ProductCardComponent } from './product-card.component';
import { AddProductModalComponent } from './add-product-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ProductCardComponent, AddProductModalComponent],
  template: `
    <div class="container">
      <div class="card" style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
        <h2>My Products</h2>
        <div style="display: flex; gap: 8px;">
          <a routerLink="/telegram" class="btn btn-secondary">Telegram</a>
          <button class="btn btn-primary" (click)="showAddModal = true">
            + Add Product
          </button>
        </div>
      </div>

      @if (loading) {
        <div class="card" style="text-align: center; padding: 40px;">
          <div>Loading...</div>
        </div>
      } @else if (error) {
        <div class="card" style="color: #d32f2f;">
          <strong>Error:</strong> {{ error }}
        </div>
      } @else if (products.length === 0) {
        <div class="card" style="text-align: center; padding: 40px;">
          <div>No products yet. Add your first Shopee product to track!</div>
        </div>
      } @else {
        @for (product of products; track product.id) {
          <app-product-card [product]="product" (delete)="deleteProduct($event)"></app-product-card>
        }
      }

      @if (showAddModal) {
        <app-add-product-modal
          (closed)="handleAddModalClosed($event)"
        ></app-add-product-modal>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';
  showAddModal = false;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = '';

    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  async handleAddModalClosed(event: any) {
    if (!event || !event.sourceUrl) {
      this.showAddModal = false;
      return;
    }

    this.loading = true;
    this.error = '';

    this.productService.create({ sourceUrl: event.sourceUrl }).subscribe({
      next: () => {
        this.showAddModal = false;
        this.loadProducts();
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to add product';
        this.loading = false;
      }
    });
  }

  deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(id).subscribe({
      next: () => this.loadProducts(),
      error: () => (this.error = 'Failed to delete product')
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
