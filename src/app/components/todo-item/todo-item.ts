import { Component, inject, input, output } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { TodoStore } from '../../services/todo';

@Component({
  selector: 'app-todo-item',
  imports: [],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.scss',
})
export class TodoItem {

  // The parent passes a Todo object
  // .required means that the parent MUST provide this 
  todo = input.required<Todo>();


  // OUTPUT -> this component fires an event UP to the parent
  // (deleteRequested) = "someMethod($event"

  deleteRequested = output<number>(); //emits the todo's id

  todoStore = inject(TodoStore)

  onToggle():void{
    this.todoStore.toggleTodo(this.todo().id);
  }

  onDelete(): void{
    // why not using the service directly and why giving the control to the parent.
    this.deleteRequested.emit(this.todo().id);
  }


}
