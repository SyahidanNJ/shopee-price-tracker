import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  sourceUrl: string;
  normalizedUrl: string;
  imageUrl: string | null;
  currentPrice: number | null;
  currency: string;
  status: string;
  lastCheckedAt: string | null;
}

export interface CreateProductRequest {
  sourceUrl: string;
}

export interface UpdateProductRequest {
  status?: string;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  create(data: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, data);
  }

  update(id: string, data: UpdateProductRequest): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/products/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      active: 'Active',
      paused: 'Paused',
      error: 'Error',
      not_found: 'Not Found',
      out_of_stock: 'Out of Stock'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      active: '#4caf50',
      paused: '#ff9800',
      error: '#f44336',
      not_found: '#9e9e9e',
      out_of_stock: '#f44336'
    };
    return colors[status] || '#9e9e9e';
  }
}
