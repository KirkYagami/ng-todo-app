import { Injectable, signal, computed, effect } from '@angular/core';
import { Todo, FilterType, Priority } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoStore {

  private readonly STORAGE_KEY = 'ng-todo-app';

  // ── Private writable signals ─────────────────────────────────
  private _todos  = signal<Todo[]>(this.loadFromStorage());
  private _filter = signal<FilterType>('all');

  // ── Public read-only signals ─────────────────────────────────
  todos         = this._todos.asReadonly();
  currentFilter = this._filter.asReadonly();

  // ── Computed signals ─────────────────────────────────────────
  filteredTodos = computed(() => {
    const all    = this._todos();
    const filter = this._filter();
    switch (filter) {
      case 'active':    return all.filter(t => !t.completed);
      case 'completed': return all.filter(t =>  t.completed);
      default:          return all;
    }
  });

  activeCount    = computed(() => this._todos().filter(t => !t.completed).length);
  completedCount = computed(() => this._todos().filter(t =>  t.completed).length);
  totalCount     = computed(() => this._todos().length);

  constructor() {
    // Auto-save on every change — 
    effect(() => this.saveToStorage(this._todos()));
  }



  toggleTodo(id: number): void {
    this._todos.update(todos =>
      todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }

  deleteTodo(id: number): void {
    this._todos.update(todos => todos.filter(t => t.id !== id));
  }

  setFilter(filter: FilterType): void {
    this._filter.set(filter);
  }

  clearCompleted(): void {
    this._todos.update(todos => todos.filter(t => !t.completed));
  }

  // ── addTodo —
  //
  // Both parameters are optional so existing callers (if any) still
  // compile. The edit form always passes all three explicitly.

  addTodo(
    title:    string,
    priority: Priority    = 'medium',
    dueDate:  Date | null = null
  ): void {
    const trimmed = title.trim();
    if (!trimmed) return;

    const newTodo: Todo = {
      id:        Date.now(),
      title:     trimmed,
      completed: false,
      createdAt: new Date(),
      priority,
      dueDate,
    };

    this._todos.update(todos => [...todos, newTodo]);
  }

  // ── updateTodo -called by the edit modal ────────────────

  updateTodo(
    id:       number,
    title:    string,
    priority: Priority,
    dueDate:  Date | null
  ): void {
    this._todos.update(todos =>
      todos.map(t =>
        t.id === id
          ? { ...t, title: title.trim(), priority, dueDate }
          : t
      )
    );
  }

  // ── Private helpers — updated to handle Date serialisation ───

  private saveToStorage(todos: Todo[]): void {
    try {
      // Dates are converted to ISO strings so JSON.stringify works.
      const serialisable = todos.map(t => ({
        ...t,
        createdAt: t.createdAt instanceof Date
          ? t.createdAt.toISOString() : t.createdAt,
        dueDate: t.dueDate instanceof Date
          ? t.dueDate.toISOString() : t.dueDate,
      }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serialisable));
    } catch {
      console.error('Could not save todos to localStorage');
    }
  }

  private loadFromStorage(): Todo[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      // Restore Date objects and supply defaults for old todos
      // that were saved before Part 2 added priority / dueDate.
      return parsed.map((t: any): Todo => ({
        ...t,
        priority:  t.priority ?? 'medium',
        dueDate:   t.dueDate  ? new Date(t.dueDate)   : null,
        createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
      }));
    } catch {
      return [];
    }
  }
}