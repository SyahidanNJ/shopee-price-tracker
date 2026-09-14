import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (!this.tokenService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/dashboard']);
    return false;
  }
}
