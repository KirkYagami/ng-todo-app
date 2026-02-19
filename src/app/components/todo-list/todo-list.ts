import { Component, inject } from '@angular/core';
import { TodoStore } from '../../services/todo';
import { TodoItem } from '../todo-item/todo-item';

@Component({
  selector: 'app-todo-list',
  imports: [TodoItem],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss',
})
export class TodoList {

  todoStore = inject(TodoStore)

    onDeleteTodo(id: number): void {
    this.todoStore.deleteTodo(id);
  }
}


