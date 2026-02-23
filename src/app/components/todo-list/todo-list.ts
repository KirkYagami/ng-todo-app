import { Component, inject } from '@angular/core';
import { TodoStore }            from '../../services/todo';
import { DynamicLoaderService } from '../../services/dynamic-loader';
import { Todo }                 from '../../models/todo.model';
import { TodoItem }             from '../todo-item/todo-item';

@Component({
  selector:    'app-todo-list',
  imports:     [TodoItem],
  templateUrl: './todo-list.html',
  styleUrl:    './todo-list.scss',
})
export class TodoList {

  todoStore = inject(TodoStore);
  private loader = inject(DynamicLoaderService);

  onDeleteTodo(id: number): void {
    this.todoStore.deleteTodo(id);
  }

  // opens the edit modal for the chosen todo
  onEditTodo(todo: Todo): void {
    this.loader.openEditModal(
      todo,
      () => this.loader.showToast('Todo updated!', 'info'),
    );
  }
}