import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Alert {
  id: string;
  productId: string;
  isActive: boolean;
  alertType: 'any_drop' | 'target_price' | 'min_drop_percentage';
  targetPrice: number | null;
  minDropPercentage: number | null;
  cooldownMinutes: number;
}

export interface UpdateAlertRequest {
  isActive?: boolean;
  alertType: 'any_drop' | 'target_price' | 'min_drop_percentage';
  targetPrice: number | null;
  minDropPercentage: number | null;
  cooldownMinutes: number;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getByProductId(productId: string): Observable<Alert> {
    return this.http.get<Alert>(`${this.apiUrl}/products/${productId}/alert`);
  }

  update(productId: string, data: UpdateAlertRequest): Observable<Alert> {
    return this.http.put<Alert>(`${this.apiUrl}/products/${productId}/alert`, data);
  }
}
