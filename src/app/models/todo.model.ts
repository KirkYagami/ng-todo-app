// we need a structure for our todo
// Todo object looks like ?

export interface Todo{
    id: number;
    title: string;
    completed: boolean;
    createdAt: Date;
}

export type FilterType =  'all' | 'active' | 'completed'
