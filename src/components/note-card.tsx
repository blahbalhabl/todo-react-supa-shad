import { Icon } from '@iconify/react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AddTodo from '@/components/add-todo';

import { useOptimistic } from '@/hooks/useOptimistic';
import { useToast } from '@/hooks/use-toast';

import { useTodos } from '@/services/useTodos';

import type { Todo } from '@/types/todos.types';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

const NoteCard = ({ note }: { note: Todo }) => {
  const filter = localStorage.getItem('filter') || 'all';
  const queryClient = useQueryClient();
  const { deleteTodo } = useTodos();
  const { toast } = useToast();
  const { mutate } = useOptimistic(filter);

  const onDelete = async (note: Todo) => {
    try {
      await deleteTodo(note.id);
      queryClient.invalidateQueries({ queryKey: ['todos', filter] });
      toast({
        title: 'Todo Deleted',
        description: 'Your todo has been deleted successfully',
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'An error occurred while deleting the todo',
      });
    }
  };

  return (
    <Card
      className={cn('w-full md:w-fit', {
        'text-neutral-300 line-through': note.done,
      })}
      data-swapy-item={note.id}
      data-id={note.id}
    >
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{note.title}</CardTitle>
          <Icon
            icon="gg:trash-empty"
            className="cursor-pointer"
            onClick={() => {
              onDelete(note);
            }}
          />
        </div>
        <CardDescription>
          <p
            className={cn('text-sm font-light', {
              'text-neutral-300': note.done,
            })}
          >
            {new Date(note?.updated_at || note.created_at).toLocaleDateString(
              'en-US',
              {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              }
            )}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{note.content}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <AddTodo note={note} />
        {!note.done && (
          <Button className="flex-grow" onClick={() => mutate(note)}>
            Done
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
