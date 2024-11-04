import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useTodos } from '@/services/useTodos';

import type { TodosResult, Todo } from '@/types/todos.types';

export const useOptimistic = (filter: string) => {
  const queryClient = useQueryClient();
  const { markTodoAsDone } = useTodos();

  return useMutation({
    mutationFn: async (todo: Todo) => {
      await markTodoAsDone(todo.id);
    },
    onMutate: async (todo: Todo) => {
      await queryClient.cancelQueries({ queryKey: ['todos', filter] });

      const previousTodos = queryClient.getQueryData<TodosResult>([
        'todos',
        filter,
      ]);

      queryClient.setQueryData<TodosResult>(['todos', filter], old => {
        if (!old) return old;
        return {
          ...old,
          data: old.data
            .map(t => (t.id === todo.id ? { ...t, done: true } : t))
            .filter(t => !(filter === 'undone' && t.done)),
        };
      });

      return { previousTodos };
    },
    onError: (_error, _, context) => {
      queryClient.setQueryData<TodosResult>(
        ['todos', filter],
        context?.previousTodos
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', filter] });
    },
  });
};
