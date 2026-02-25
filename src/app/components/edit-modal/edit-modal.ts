import { Component, input, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { TodoStore }      from '../../services/todo';
import { Todo, Priority } from '../../models/todo.model';

@Component({
  selector:    'app-edit-modal',
  imports:     [ReactiveFormsModule],
  templateUrl: './edit-modal.html',
  styleUrl:    './edit-modal.scss',
})
export class EditModal implements OnInit {

  todo    = input.required<Todo>();
  onClose = input<() => void>(() => {});
  onSaved = input<() => void>(() => {});

  private store = inject(TodoStore);

  form!: FormGroup;
  readonly priorities: Priority[] = ['low', 'medium', 'high'];

  ngOnInit(): void {
    const t = this.todo();
    this.form = new FormGroup({
      title: new FormControl(t.title, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(200)],
      }),
      description: new FormControl(t.description ?? '', { nonNullable: true }),
      priority: new FormControl<Priority>(t.priority, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      dueDate: new FormControl(
        t.dueDate ? this.toDateInputValue(t.dueDate) : '',
        { nonNullable: true }
      ),
    });
  }

  get titleCtrl()    { return this.form.controls['title'];    }
  get priorityCtrl() { return this.form.controls['priority']; }
  get dueDateCtrl()  { return this.form.controls['dueDate'];  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { title, description, priority, dueDate } = this.form.getRawValue();

    this.store.updateTodo(
      this.todo().id,
      title,
      description || null,
      priority,
      dueDate ? new Date(dueDate) : null,
    ).subscribe({
      next:  () => this.onSaved()(),
      error: () => {},  // DynamicLoaderService caller can show error toast
    });
  }

  onCancel(): void { this.onClose()(); }

  private toDateInputValue(d: Date): string {
    return new Date(d).toISOString().split('T')[0];
  }
}