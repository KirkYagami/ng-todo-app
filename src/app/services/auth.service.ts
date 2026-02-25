import { Injectable, signal, inject } from '@angular/core';
import { HttpClient }                 from '@angular/common/http';
import { Router }                     from '@angular/router';
import { tap }                        from 'rxjs';
import { LoginRequest, SignupRequest, AuthResponse } from '../models/todo.model';
import { TodoStore } from './todo';

const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private http   = inject(HttpClient);
  private router = inject(Router);
  private store  = inject(TodoStore);

  private API = 'http://localhost:8080/api/auth';

  // ── Signals ───────────────────────────────────────────────────
  private _user = signal<AuthResponse | null>(this.loadUser());

  currentUser = this._user.asReadonly();
  isLoggedIn  = () => this._user() !== null;

  // ── Auth methods ──────────────────────────────────────────────

  login(body: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.API}/login`, body).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY,  JSON.stringify(res));
        this._user.set(res);
      })
    );
  }

  signup(body: SignupRequest) {
    return this.http.post<string>(`${this.API}/signup`, body);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._user.set(null);
    this.store.clear();
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private loadUser(): AuthResponse | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}