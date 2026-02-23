// we need a structure for our todo
// Todo object looks like ?

// src/app/models/todo.model.ts

export type Priority   = 'low' | 'medium' | 'high';
export type FilterType = 'all' | 'active' | 'completed';

export interface Todo {
  id:        number;
  title:     string;
  completed: boolean;
  createdAt: Date;
  priority:  Priority;    // always present, defaults to 'medium'
  dueDate:   Date | null; // null means no due date chosen
}

