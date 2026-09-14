import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container">
      <header class="card" style="margin-bottom: 24px;">
        <h1>🛍️ Shopee Price Tracker</h1>
        <p>Monitor product prices and get Telegram notifications when prices drop</p>
        <div style="margin-top: 16px;">
          <a routerLink="/login" class="btn btn-primary">Login</a>
          <a routerLink="/register" class="btn btn-secondary" style="margin-left: 8px;">Register</a>
        </div>
      </header>

      <section class="card">
        <h2>How it works</h2>
        <ol>
          <li>Register and login to your account</li>
          <li>Add Shopee product links to your watchlist</li>
          <li>Set your target price or alert preferences</li>
          <li>Connect your Telegram account</li>
          <li>Receive notifications when prices drop!</li>
        </ol>
      </section>
    </div>
  `
})
export class HomeComponent {}
