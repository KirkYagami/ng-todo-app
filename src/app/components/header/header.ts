import { Component, inject } from '@angular/core';
import { TodoStore } from '../../services/todo';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  todoStore = inject(TodoStore);
}