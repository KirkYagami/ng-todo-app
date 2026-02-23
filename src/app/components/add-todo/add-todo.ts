import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { TodoStore }             from '../../services/todo';
import { DynamicLoaderService }  from '../../services/dynamic-loader';
import { Priority }              from '../../models/todo.model';

@Component({
  selector:    'app-add-todo',
  imports:     [ReactiveFormsModule],
  templateUrl: './add-todo.html',
  styleUrl:    './add-todo.scss',
})
export class AddTodo {

  private store  = inject(TodoStore);
  private loader = inject(DynamicLoaderService);

  // Controls whether the priority + due-date row is visible
  showOptions = false;

  readonly priorities: Priority[] = ['low', 'medium', 'high'];

  // ── Reactive Form ─────────────────────────────────────────────
  //
  // Defined as a class field (not in ngOnInit) because it has no
  // dependency on async data or inputs — it can be created eagerly.

  form = new FormGroup({

    title: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(200),
      ],
    }),

    priority: new FormControl<Priority>('medium', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    dueDate: new FormControl('', { nonNullable: true }),

  });

  // Convenience getters
  get titleCtrl()    { return this.form.controls.title;    }
  get priorityCtrl() { return this.form.controls.priority; }

  // ── Handlers ─────────────────────────────────────────────────
  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') { e.preventDefault(); this.submit(); }
  }

  onAddClick(): void { this.submit(); }

  toggleOptions(): void { this.showOptions = !this.showOptions; }

  // ── Submit ────────────────────────────────────────────────────
  private submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { title, priority, dueDate } = this.form.getRawValue();

    this.store.addTodo(
      title,
      priority,
      dueDate ? new Date(dueDate) : null,
    );

    this.loader.showToast(`Added: "${title}"`, 'success');

    // Reset to defaults
    this.form.reset({ title: '', priority: 'medium', dueDate: '' });
    this.showOptions = false;
  }
}