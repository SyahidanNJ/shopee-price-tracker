import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';

  setAccessToken(token: string) {
    localStorage.setItem(this.accessTokenKey, token);
  }

  getAccessToken() {
    return localStorage.getItem(this.accessTokenKey);
  }

  removeAccessToken() {
    localStorage.removeItem(this.accessTokenKey);
  }

  setRefreshToken(token: string) {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  removeRefreshToken() {
    localStorage.removeItem(this.refreshTokenKey);
  }

  clearTokens() {
    this.removeAccessToken();
    this.removeRefreshToken();
  }

  isAuthenticated() {
    return !!this.getAccessToken();
  }
}
