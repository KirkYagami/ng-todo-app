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

  // ── Set by DynamicLoaderService ───────────────────────────────
  todo      = input.required<Todo>();
  onClose   = input<() => void>(() => {});  // close without saving
  onSaved   = input<() => void>(() => {});  // close after saving

  private store = inject(TodoStore);

  // ── Reactive Form ─────────────────────────────────────────────
  //
  // Declared here but populated in ngOnInit because we need
  // this.todo() — which is only set after Angular resolves inputs.
  form!: FormGroup;

  // Expose priority levels for the template @for loop
  readonly priorities: Priority[] = ['low', 'medium', 'high'];

  ngOnInit(): void {
    const t = this.todo();

    this.form = new FormGroup({

      // title: required, at least 2 characters
      title: new FormControl(t.title, {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(200),
        ],
      }),

      // priority: required, one of the three union values
      priority: new FormControl<Priority>(t.priority, {
        nonNullable: true,
        validators: [Validators.required],
      }),

      // dueDate: optional date — stored as "YYYY-MM-DD" string for
      // the <input type="date"> element, converted to Date on save
      dueDate: new FormControl(
        t.dueDate ? this.toDateInputValue(t.dueDate) : '',
        { nonNullable: true }
      ),

    });
  }

  // ── Getters for cleaner template access ───────────────────────
  get titleCtrl()    { return this.form.controls['title'];    }
  get priorityCtrl() { return this.form.controls['priority']; }
  get dueDateCtrl()  { return this.form.controls['dueDate'];  }

  // ── Submit ────────────────────────────────────────────────────
  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { title, priority, dueDate } = this.form.getRawValue();

    this.store.updateTodo(
      this.todo().id,
      title,
      priority,
      dueDate ? new Date(dueDate) : null,
    );

    this.onSaved()();   // signal to the service that save succeeded
  }

  onCancel(): void {
    this.onClose()();
  }

  // ── Helper ────────────────────────────────────────────────────
  // <input type="date"> needs "YYYY-MM-DD", not a Date object.
  private toDateInputValue(d: Date): string {
    return new Date(d).toISOString().split('T')[0];
  }
}