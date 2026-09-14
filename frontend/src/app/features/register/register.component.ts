import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="card" style="max-width: 400px; margin: 40px auto;">
        <h2>Register</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px;">Name</label>
            <input
              type="text"
              formControlName="name"
              style="width: 100%; padding: 8px;"
            />
            @if (form.get('name')?.touched && form.get('name')?.errors) {
              <small style="color: #d32f2f;">Name is required</small>
            }
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px;">Email</label>
            <input
              type="email"
              formControlName="email"
              style="width: 100%; padding: 8px;"
            />
            @if (form.get('email')?.touched && form.get('email')?.errors) {
              <small style="color: #d32f2f;">
                @if (form.get('email')?.errors?.['required']) { Email is required }
                @if (form.get('email')?.errors?.['email']) { Invalid email format }
              </small>
            }
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px;">Password</label>
            <input
              type="password"
              formControlName="password"
              style="width: 100%; padding: 8px;"
            />
            @if (form.get('password')?.touched && form.get('password')?.errors) {
              <small style="color: #d32f2f;">
                @if (form.get('password')?.errors?.['required']) { Password is required }
                @if (form.get('password')?.errors?.['minlength']) { Minimum 8 characters }
              </small>
            }
          </div>

          @if (error) {
            <p style="color: #d32f2f; margin-bottom: 16px;">{{ error }}</p>
          }

          <button
            type="submit"
            class="btn btn-primary"
            style="width: 100%;"
            [disabled]="form.invalid || loading"
          >
            {{ loading ? 'Registering...' : 'Register' }}
          </button>

          <p style="text-align: center; margin-top: 16px;">
            Already have an account? 
            <a href="/login" style="color: #ee4d2d;">Login</a>
          </p>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    this.authService.register(this.form.value).subscribe({
      next: (data) => {
        this.authService.setToken(data.accessToken);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
