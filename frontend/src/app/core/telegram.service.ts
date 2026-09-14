import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TelegramBinding {
  isBound: boolean;
  telegramUserId?: string;
  telegramUsername?: string;
}

export interface BindingResponse {
  bindingCode: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class TelegramService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getStatus(): Observable<TelegramBinding> {
    return this.http.get<TelegramBinding>(`${this.apiUrl}/telegram/status`);
  }

  bind(): Observable<BindingResponse> {
    return this.http.post<BindingResponse>(`${this.apiUrl}/telegram/bind`, {});
  }

  unbind(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/telegram/unbind`, {});
  }

  test(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/telegram/test`, {});
  }
}
