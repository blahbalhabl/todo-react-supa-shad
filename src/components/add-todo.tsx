import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

import { useTodos } from '@/services/useTodos';

import { Todo } from '@/types/todos.types';

const newTodoSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

const AddTodo = ({ note }: { note?: Todo }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { createTodo, updateTodo } = useTodos();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const filter = localStorage.getItem('filter') || 'all';

  const form = useForm<z.infer<typeof newTodoSchema>>({
    resolver: zodResolver(newTodoSchema),
    defaultValues: {
      title: note?.title || '',
      content: note?.content || '',
    },
  });

  const onSubmit = async (data: z.infer<typeof newTodoSchema>) => {
    try {
      if (note) {
        await updateTodo(note.id, {
          title: data.title,
          content: data.content,
        });
        toast({
          title: 'Todo Updated',
          description: 'Your todo has been updated successfully',
        });
        setOpen(false); // Close the dialog
        return;
      }
      await createTodo({
        title: data.title,
        content: data.content,
      });
      toast({
        title: 'Todo Added',
        description: 'Your todo has been added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['todos', filter] });
      setOpen(false); // Close the dialog
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error: unknown) {
      toast({
        title: 'Error',
        description: 'An error occurred while adding the todo',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-fit"
          variant={note ? 'outline' : 'default'}
          onClick={() => setOpen(true)}
        >
          {note ? 'Edit' : 'Add Todo'}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 rounded-xl">
        <DialogHeader>
          <DialogTitle>{note ? 'Edit Todo' : 'Add Todo'}</DialogTitle>
          <DialogDescription>
            {note ? 'Edit your todo item' : 'Add a new todo item to your list'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="form"
            onSubmit={form.handleSubmit(onSubmit)}
            key={note ? note.id : 'new'}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the title of the todo item
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="content">Content</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter content" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the content of the todo item
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button form="form" type="submit">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTodo;
