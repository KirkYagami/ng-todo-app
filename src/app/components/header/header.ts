import { Component, inject } from '@angular/core';
import { Router }            from '@angular/router';
import { TodoStore }         from '../../services/todo';
import { AuthService }       from '../../services/auth.service';



@Component({
  selector:    'app-header',
  imports:     [],
  templateUrl: './header.html',
  styleUrl:    './header.scss',
})
export class Header {
  todoStore   = inject(TodoStore);
  authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}