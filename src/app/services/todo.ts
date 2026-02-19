import { Injectable, signal, computed, effect } from '@angular/core';
import {Todo, FilterType} from '../models/todo.model';



@Injectable({
  providedIn: 'root', // one instance shared across the whole app
})
export class TodoStore {

  private readonly STORAGE_KEY = 'ng-todo-app';

  // writeable inside the service only
  private _todos =  signal<Todo[]>(this.loadFromStorage());
  private _filter = signal<FilterType>('all')


  // public readonly signals
  todos  = this._todos.asReadonly();
  currentFilter = this._filter.asReadonly();


  filteredTodos = computed(() =>{
    const todos = this._todos();
    const filter = this._filter();

    switch(filter){
      case 'active': return todos.filter(t=> !t.completed);
      case 'completed': return todos.filter(t=> t.completed);
      default: return todos; // 'all'
    }
  });


  // activeCount, completedCount, totalCount

  activeCount = computed(()=> this._todos().filter(t=> !t.completed).length);
  completedCount = computed(()=> this._todos().filter(t=> t.completed).length);
  totalCount = computed(()=> this.todos().length);

 
  constructor(){
    // effect() runs once immediately, then re-runs whenever _todos() changes.
    // this auto-saves to local storage on every add /toggle/ delete

    effect(()=>{
      this.saveToStorage(this._todos());
    }
    )
  }

  addTodo(title: string): void {
    const trimmed = title.trim();

    if (!trimmed) return; 
    const newTodo: Todo = {
      id: Date.now(),
      title: trimmed,
      completed: false,
      createdAt: new Date()
    };
    this._todos.update(todos => [...todos, newTodo]);
  }


    toggleTodo(id: number): void{
      this._todos.update(todos =>
        todos.map(todo =>
          todo.id === id
          ? {...todo, completed: !todo.completed}
          : todo
        )
      );
    }

    deleteTodo(id:number): void{
      this._todos.update(todos =>
        todos.filter(todo => todo.id !== id)
      );
    }


  setFilter(filter: FilterType): void {
    this._filter.set(filter);
  }


  clearCompleted(): void {
    this._todos.update(todos => todos.filter(t => !t.completed));
  }


  private saveToStorage(todos: Todo[]): void{
    try{
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    }catch{
      console.error('Could not save todos to local storage')
    }

  }

  private loadFromStorage():Todo[]{
    try{
      const raw = localStorage.getItem(this.STORAGE_KEY)
      if (!raw) return [];
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed: [];
    }catch{
      return [];
    }

  }











  
}
