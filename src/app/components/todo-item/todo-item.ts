import { Component, inject, input, output, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Todo }              from '../../models/todo.model';
import { TodoStore }         from '../../services/todo';
import { DynamicLoaderService } from '../../services/dynamic-loader';

@Component({
  selector:    'app-todo-item',
  imports:     [DatePipe],
  templateUrl: './todo-item.html',
  styleUrl:    './todo-item.scss',
})
export class TodoItem {

  todo = input.required<Todo>();

  // Keeps the same output so TodoList needs minimal changes
  deleteRequested = output<number>();

  // NEW — emits the whole Todo so TodoList can open the edit modal
  editRequested   = output<Todo>();

  private store  = inject(TodoStore);
  private loader = inject(DynamicLoaderService);

  // ── Computed signals ─────────────────────────────────────────
  isOverdue = computed(() => {
    const due = this.todo().dueDate;
    if (!due || this.todo().completed) return false;
    return new Date(due) < new Date();
  });

  // ── Handlers ─────────────────────────────────────────────────
  onToggle(): void {
    this.store.toggleTodo(this.todo().id);
    // Show a toast only when *completing* (not un-completing)
    if (!this.todo().completed) {
      this.loader.showToast('Marked as done ✓', 'success');
    }
  }

  onDelete(): void {
    // Ask first — DynamicLoaderService creates the dialog
    this.loader.confirm(
      `Delete "${this.todo().title}"?`,
      () => {
        this.deleteRequested.emit(this.todo().id);
        this.loader.showToast('Todo deleted', 'error');
      },
    );
  }

  onEdit(): void {
    this.editRequested.emit(this.todo());
  }
}