import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createSwapy } from 'swapy';

import NoteCard from '@/components/note-card';
import Header from '@/components/header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

import { useTodos } from '@/services/useTodos';

const Home = () => {
  const [filter, setFilter] = useState<string>(
    localStorage.getItem('filter') || 'all'
  );
  const [slotItems] = useState<
    {
      slotId: string;
      itemId: string;
    }[]
  >(JSON.parse(localStorage.getItem('slotItem') || '[]'));

  const { getTodos } = useTodos();

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['todos', filter],
    queryFn: async () => await getTodos(10, 0, -1, filter),
  });

  useEffect(() => {
    if (!isSuccess) return;

    const container = document.querySelector('.container')!;

    const swapy = createSwapy(container, {
      swapMode: 'hover',
      animation: 'spring',
    });

    if (container) {
      swapy.enable(true);
    }

    swapy.onSwap(({ data }) => {
      localStorage.setItem('slotItem', JSON.stringify(data.array));
    });

    return () => {
      swapy.destroy();
    };
  }, [isSuccess]);

  const renderTodos = () => {
    if (slotItems.length > 0) {
      return slotItems.map((slotItem, i) => {
        const todo = data?.data?.find(t => t.id === slotItem.itemId);
        return todo ? (
          <div className="w-full md:w-auto" key={todo.id} data-swapy-slot={i}>
            <NoteCard key={todo.id} note={todo} />
          </div>
        ) : null;
      });
    } else {
      return data?.data?.map((todo, i) => (
        <div className="w-full md:w-auto" key={todo.id} data-swapy-slot={i}>
          <NoteCard key={todo.id} note={todo} />
        </div>
      ));
    }
  };

  return (
    <div className="mx-3 flex flex-col gap-5 py-10 md:mx-auto md:max-w-[70%]">
      <Header />
      <div className="flex justify-end">
        <Select
          value={filter}
          onValueChange={value => {
            setFilter(value);
            localStorage.setItem('filter', value);
          }}
        >
          <SelectTrigger className="md:w-56">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="undone">Undone</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="container flex flex-wrap gap-5">
        {isLoading &&
          [...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-52 w-full md:size-52" />
          ))}
        {renderTodos()}
      </div>
    </div>
  );
};

export default Home;
