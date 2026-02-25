import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { TodoStore }            from '../../services/todo';
import { DynamicLoaderService } from '../../services/dynamic-loader';
import { Priority }             from '../../models/todo.model';

@Component({
  selector:    'app-add-todo',
  imports:     [ReactiveFormsModule],
  templateUrl: './add-todo.html',
  styleUrl:    './add-todo.scss',
})
export class AddTodo {

  private store  = inject(TodoStore);
  private loader = inject(DynamicLoaderService);

  showOptions = false;
  readonly priorities: Priority[] = ['low', 'medium', 'high'];

  form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(200)],
    }),
    description: new FormControl('', { nonNullable: true }),
    priority: new FormControl<Priority>('medium', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    dueDate: new FormControl('', { nonNullable: true }),
  });

  get titleCtrl()    { return this.form.controls.title;    }
  get priorityCtrl() { return this.form.controls.priority; }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') { e.preventDefault(); this.submit(); }
  }

  onAddClick(): void { this.submit(); }
  toggleOptions(): void { this.showOptions = !this.showOptions; }

  private submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { title, description, priority, dueDate } = this.form.getRawValue();

    this.store.addTodo(
      title,
      description || null,
      priority,
      dueDate ? new Date(dueDate) : null,
    ).subscribe({
      next: () => {
        this.loader.showToast(`Added: "${title}"`, 'success');
        this.form.reset({ title: '', description: '', priority: 'medium', dueDate: '' });
        this.showOptions = false;
      },
      error: () => this.loader.showToast('Failed to add task', 'error'),
    });
  }
}