import { Component, inject, OnInit } from '@angular/core';
import { TodoStore }  from '../services/todo';
import { AddTodo }    from '../components/add-todo/add-todo';
import { TodoList }   from '../components/todo-list/todo-list';
import { FilterBar }  from '../components/filter-bar/filter-bar';

@Component({
  selector:  'app-home',
  imports:   [AddTodo, TodoList, FilterBar],
  templateUrl: './home.html',
  styleUrl:    './home.scss',
})
export class Home implements OnInit {
  todoStore = inject(TodoStore);

  ngOnInit(): void {
    this.todoStore.loadTasks();
  }
}