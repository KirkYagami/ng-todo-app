import { Component, inject, signal, computed } from '@angular/core';
import { TodoStore } from '../../services/todo';

@Component({
  selector: 'app-add-todo',
  imports: [],
  templateUrl: './add-todo.html',
  styleUrl: './add-todo.scss',
})
export class AddTodo {
  todoStore = inject(TodoStore)

  // Signal -> tracks what the user is currently typing
  inputValue = signal('');

  charsRemaining = computed(()=> 200 -this.inputValue().length);
  isNearLimit = computed(()=> this.charsRemaining() <= 20);

  // called on every keystroke in the input
  OnInputChange(event: Event):void{
    const input = event.target as HTMLInputElement;
    this.inputValue.set(input.value);
  }

  // called on keyup - submit on enter

  onKeyUp(event: KeyboardEvent): void{
    if (event.key === 'Enter'){
      this.submit()
    }
  }

onAddClick():void{
  this.submit()
}


private submit():void{
  const title = this.inputValue().trim();
  if (!title) return;

  this.todoStore.addTodo(title);
  this.inputValue.set('');
}




  
  











}
