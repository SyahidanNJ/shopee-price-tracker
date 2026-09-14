import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.getAccessToken();

    if (token && !req.url.includes('/auth')) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return this.handleRequest(authReq, next);
    }

    return this.handleRequest(req, next);
  }

  private handleRequest(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('/refresh')) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.tokenService.getRefreshToken();

      if (refreshToken) {
        return this.refreshToken(refreshToken).pipe(
          switchMap((token: string) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token);
            return next.handle(this.addToken(req, token));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.tokenService.clearTokens();
            this.router.navigate(['/login']);
            return throwError(() => err);
          })
        );
      } else {
        this.isRefreshing = false;
        this.tokenService.clearTokens();
        this.router.navigate(['/login']);
        return throwError(() => 'No refresh token');
      }
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addToken(req, token)))
    );
  }

  private refreshToken(token: string): Observable<string> {
    return new Observable((observer) => {
      fetch(`${this.getApiUrl()}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: token })
      })
        .then((res) => {
          if (!res.ok) throw new Error('Refresh failed');
          return res.json();
        })
        .then((data) => {
          this.tokenService.setAccessToken(data.accessToken);
          this.tokenService.setRefreshToken(data.refreshToken);
          observer.next(data.accessToken);
          observer.complete();
        })
        .catch((err) => {
          observer.error(err);
        });
    });
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  private getApiUrl(): string {
    return 'http://localhost:3000/api';
  }
}
