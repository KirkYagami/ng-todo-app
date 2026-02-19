import { Component, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { TodoStore } from '../../services/todo';
import { FilterType } from '../../models/todo.model';

@Component({
  selector: 'app-filter-bar',
  imports: [TitleCasePipe],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.scss'
})
export class FilterBar {
  todoStore = inject(TodoStore);

  readonly filters: FilterType[] = ['all', 'active', 'completed'];

  onSetFilter(filter: FilterType): void {
    this.todoStore.setFilter(filter);
  }

  onClearCompleted(): void {
    this.todoStore.clearCompleted();
  }
}