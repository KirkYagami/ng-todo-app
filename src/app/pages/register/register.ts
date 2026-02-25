import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService }        from '../../services/auth.service';

@Component({
  selector:    'app-register',
  imports:     [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl:    './register.scss',
})
export class RegisterPage {

  private auth   = inject(AuthService);
  private router = inject(Router);

  error   = '';
  success = '';
  loading = false;

  form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    email:    new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
  });

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    this.error   = '';
    this.success = '';

    this.auth.signup(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Account created! Redirecting to login…';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (e) => {
        this.loading = false;
        this.error = typeof e.error === 'string' ? e.error : 'Registration failed. Try again.';
      },
    });
  }
}