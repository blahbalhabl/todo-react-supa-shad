/**
 * @module useTodos
 * @desc This module provides a custom hook to manage todos.
 */

import { paginate, supabase } from '@/lib/utils';
import type { NewTodo, TodosResult } from '@/types/todos.types';

export const useTodos = () => {
  const getTodos = async (
    limit: number,
    offset: number,
    sort: number = -1,
    filter: string
  ): Promise<TodosResult> => {
    // Fetch the paginated todos
    let query = supabase
      .from('todos')
      .select('*')
      .order('updated_at', { ascending: sort === 1 })
      .range(offset, offset + limit - 1)
      .throwOnError();

    // Apply the filter if provided
    if (filter === 'done') {
      query = query.eq('done', true);
    } else if (filter === 'undone') {
      query = query.eq('done', false);
    }

    const { data, error } = await query;

    if (error) throw error;

    return paginate(data, 'todos', limit, offset);
  };

  const createTodo = async (todo: NewTodo) => {
    const { data, error } = await supabase
      .from('todos')
      .insert(todo)
      .throwOnError();
    if (error) throw error;
    return data;
  };

  const markTodoAsDone = async (id: string) => {
    const { data, error } = await supabase
      .from('todos')
      .update({ done: true })
      .match({ id })
      .throwOnError();
    if (error) throw error;
    return data;
  };

  const updateTodo = async (id: string, todo: NewTodo) => {
    const { data, error } = await supabase
      .from('todos')
      .update(todo)
      .match({ id })
      .throwOnError();
    if (error) throw error;
    return data;
  };

  const deleteTodo = async (id: string) => {
    const { data, error } = await supabase
      .from('todos')
      .delete()
      .match({ id })
      .throwOnError();
    if (error) throw error;
    return data;
  };

  return {
    getTodos,
    createTodo,
    markTodoAsDone,
    updateTodo,
    deleteTodo,
  };
};
