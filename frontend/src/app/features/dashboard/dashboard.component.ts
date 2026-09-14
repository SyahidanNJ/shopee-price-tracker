import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="container">
      <div class="card">
        <h2>Dashboard</h2>
        <p>Welcome! This page is protected.</p>
        <button class="btn btn-secondary" (click)="logout()">Logout</button>
      </div>
    </div>
  `
})
export class DashboardComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
