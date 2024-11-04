import { useEffect } from 'react';
import AddTodo from '@/components/add-todo';

const Header = () => {
  // Function to toggle the theme
  const onThemeChange = () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <header className="flex items-center justify-between">
      <div>
        <h1
          className="cursor-pointer text-2xl font-bold"
          onClick={onThemeChange}
        >
          Todos
        </h1>
        <p className="text-gray-500">A simple todo app</p>
      </div>
      <AddTodo />
    </header>
  );
};

export default Header;
