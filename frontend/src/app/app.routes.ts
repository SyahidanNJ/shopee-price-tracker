import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { GuestGuard } from './core/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', canActivate: [GuestGuard], loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', canActivate: [GuestGuard], loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent) },
  { path: 'dashboard', canActivate: [AuthGuard], loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'product/:id', canActivate: [AuthGuard], loadComponent: () => import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'telegram', canActivate: [AuthGuard], loadComponent: () => import('./features/telegram-settings/telegram-settings.component').then(m => m.TelegramSettingsComponent) }
];
