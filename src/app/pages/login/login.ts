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
  selector:    'app-login',
  imports:     [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl:    './login.scss',
})
export class LoginPage {

  private auth   = inject(AuthService);
  private router = inject(Router);

  error   = '';
  loading = false;

  form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    this.error   = '';

    this.auth.login(this.form.getRawValue()).subscribe({
      next:  () => { this.loading = false; this.router.navigate(['/']); },
      error: (e) => {
        this.loading = false;
        this.error = e.status === 401 ? 'Invalid username or password.' : 'Login failed. Try again.';
      },
    });
  }
}