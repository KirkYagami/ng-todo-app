import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient }                           from '@angular/common/http';
import { Observable, tap }                      from 'rxjs';
import { Todo, TaskResponse, FilterType, Priority } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoStore {

  private http    = inject(HttpClient);
  private API     = 'http://localhost:8080/api/tasks';

  // ── Private state ────────────────────────────────────────────
  private _todos  = signal<Todo[]>([]);
  private _filter = signal<FilterType>('all');
  private _loading = signal(false);

  // ── Public signals ───────────────────────────────────────────
  todos         = this._todos.asReadonly();
  currentFilter = this._filter.asReadonly();
  loading       = this._loading.asReadonly();

  // ── Computed ─────────────────────────────────────────────────
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

  // ── Map backend shape → frontend Todo ────────────────────────
  private fromResponse(r: TaskResponse): Todo {
    return {
      id:          r.id,
      title:       r.title,
      description: r.description ?? null,
      completed:   r.completed,
      priority:    (r.priority as Priority) ?? 'medium',
      dueDate:     r.dueDate   ? new Date(r.dueDate)   : null,
      createdAt:   r.createdAt ? new Date(r.createdAt) : new Date(),
    };
  }

  // ── API methods ───────────────────────────────────────────────

  /** Load all tasks for the logged-in user into the signal store */
  loadTasks(): void {
    this._loading.set(true);
    this.http.get<TaskResponse[]>(this.API).subscribe({
      next:  (data) => { this._todos.set(data.map(r => this.fromResponse(r))); this._loading.set(false); },
      error: ()     => this._loading.set(false),
    });
  }

  addTodo(
    title:       string,
    description: string | null = null,
    priority:    Priority      = 'medium',
    dueDate:     Date | null   = null,
  ): Observable<TaskResponse> {
    const body = {
      title:       title.trim(),
      description,
      priority,
      dueDate:     dueDate ? dueDate.toISOString().split('T')[0] : null,
      completed:   false,
    };
    return this.http.post<TaskResponse>(this.API, body).pipe(
      tap(r => this._todos.update(ts => [...ts, this.fromResponse(r)]))
    );
  }

  updateTodo(
    id:          number,
    title:       string,
    description: string | null,
    priority:    Priority,
    dueDate:     Date | null,
  ): Observable<TaskResponse> {
    const existing = this._todos().find(t => t.id === id);
    const body = {
      title:       title.trim(),
      description,
      priority,
      dueDate:     dueDate ? dueDate.toISOString().split('T')[0] : null,
      completed:   existing?.completed ?? false,
    };
    return this.http.put<TaskResponse>(`${this.API}/${id}`, body).pipe(
      tap(r => this._todos.update(ts => ts.map(t => t.id === id ? this.fromResponse(r) : t)))
    );
  }

  toggleTodo(id: number): void {
    this.http.patch<TaskResponse>(`${this.API}/${id}/complete`, {}).subscribe({
      next: r => this._todos.update(ts => ts.map(t => t.id === id ? this.fromResponse(r) : t)),
    });
    // Optimistic update for instant UI feedback
    this._todos.update(ts =>
      ts.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }

  deleteTodo(id: number): void {
    // Optimistic remove
    this._todos.update(ts => ts.filter(t => t.id !== id));
    this.http.delete(`${this.API}/${id}`).subscribe({
      error: () => this.loadTasks(), // rollback on failure
    });
  }

  setFilter(filter: FilterType): void {
    this._filter.set(filter);
  }

  clearCompleted(): void {
    const completed = this._todos().filter(t => t.completed);
    // Remove optimistically, then fire delete requests
    this._todos.update(ts => ts.filter(t => !t.completed));
    completed.forEach(t => this.http.delete(`${this.API}/${t.id}`).subscribe());
  }

  /** Call this when the user logs out to clear local state */
  clear(): void {
    this._todos.set([]);
    this._filter.set('all');
  }
}